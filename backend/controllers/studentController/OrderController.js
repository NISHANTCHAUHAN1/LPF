import { Order } from "../../models/Order.js";
import paypal from "paypal-rest-sdk";

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

