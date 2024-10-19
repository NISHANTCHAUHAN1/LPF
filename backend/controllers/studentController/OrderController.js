import { Order } from "../../models/Order.js";
import paypal from "paypal-rest-sdk";
import { StudentCourses } from "../../models/StudentCourses.js";
import { Course } from "../../models/Course.js";

export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      orderStatus,
      paymentMethod,
      paymentStatus,
      orderDate,
      instructorId,
      instructorName,
      courseImage,
      courseTitle,
      courseId,
      coursePricing,
    } = req.body;

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `${process.env.CLIENT_URL}/payment-return`,
        cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: courseTitle,
                sku: courseId,
                price: parseFloat(coursePricing).toFixed(2),
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: parseFloat(coursePricing).toFixed(2),
          },
          description: courseTitle,
        },
      ],
    };

    const createPayment = (paymentJson) =>
      new Promise((resolve, reject) => {
        paypal.payment.create(paymentJson, (error, payment) => {
          if (error) reject(error);
          else resolve(payment);
        });
      });

    const paymentInfo = await createPayment(create_payment_json);

    const approveUrl = paymentInfo?.links?.find(
      (link) => link.rel === "approval_url"
    )?.href;

    if (!approveUrl) {
      return res.status(500).json({
        success: false,
        message: "Approval URL not found!",
      });
    }

    const newOrder = new Order({
      userId,
      userName,
      userEmail,
      orderStatus: orderStatus || "pending",
      paymentMethod,
      paymentStatus: paymentStatus || "pending",
      orderDate,
      instructorId,
      instructorName,
      courseImage,
      courseTitle,
      courseId,
      coursePricing,
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      data: {
        approveUrl,
        orderId: newOrder._id,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};


export const capturePaymentAndFinalizeOrder = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    await order.save();

    // now update student course model
    const studentCourses = await StudentCourses.findOne({
      userId: order.userId,
    });

    // if i buy first time any course like react js then else block code is run
    // if i buy 2 time a course after react js then if code is run;
    if (studentCourses) {
      studentCourses.courses.push({
        courseId: order.courseId,
        title: order.courseTitle,
        instructorId: order.instructorId,
        instructorName: order.instructorName,
        dateOfPurchase: order.orderDate,
        courseImage: order.courseImage,
      });
      await studentCourses.save();

    } else {
      const newStudentCourses = new StudentCourses({
        userId: order.userId,
        courses: [
          {
            courseId: order.courseId,
            title: order.courseTitle,
            instructorId: order.instructorId,
            instructorName: order.instructorName,
            dateOfPurchase: order.orderDate,
            courseImage: order.courseImage,
          },
        ],
      });
      await newStudentCourses.save();
    }

    //update the course schema To see how many students have bought the course and who they are.
    await Course.findByIdAndUpdate(order.courseId, {
      $addToSet: {
        students : {
          studentId: order.userId,
          studentName: order.userName,
          studentEmail: order.userEmail,
          paidAmount: order.coursePricing,
        }
      }
    })

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};
