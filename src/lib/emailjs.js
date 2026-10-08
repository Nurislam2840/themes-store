import emailjs from '@emailjs/browser';

export const sendApprovalEmail = async ({ 
  customer_name, 
  customer_email, 
  theme_title, 
  theme_price, 
  transaction_id, 
  order_id 
}) => {
  try {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    // ডাউনলোড লিংক (ডেপ্লয়ের পর আসল ডোমেইন বসাবেন)
    const downloadLink = `http://127.0.0.1:3000/download/${order_id}`;

    const templateParams = {
      customer_name: customer_name || 'Customer',
      customer_email: customer_email,
      theme_title: theme_title,
      theme_price: theme_price,
      transaction_id: transaction_id,
      download_link: downloadLink,
      to_email: customer_email,
    };

    const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);
    console.log('✅ Email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('❌ Email send failed:', error);
    return { success: false, error: error.text || error.message };
  }
};