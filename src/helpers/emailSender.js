// emailSender.js

export const notifyMaria = async (realTimeQuote) => {
    const subject = 'Quote Updated';
    const textBody = `The quote with ID ${realTimeQuote.id} has been updated.`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; margin: 20px;">
        <h2 style="color: #333;">Quote Updated</h2>
        <p style="font-size: 16px; color: #555;">
          The quote with ID ${realTimeQuote.id} has been updated. Click the button below to view the details:
        </p>
        <a href="https://shipping-quote.labelslab.com/packaging-details/${realTimeQuote.id}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; color: white; background-color: #007BFF; text-decoration: none; border-radius: 5px;">
          View the Quote
        </a>
        <p style="font-size: 14px; color: #999; margin-top: 20px;">
          If you have any questions, please contact us at <a href="mailto:vaibhav@designersprescription.com" style="color: #007BFF;">vaibhav@designersprescription.com</a>.
        </p>
      </div>
    `;
  
    try {
      const response = await fetch('https://ghft6mowc4.execute-api.us-east-2.amazonaws.com/default/QuoteForm-EmailSender', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipientEmail: 'maria@labelslab.com',
          subject: subject,
          textBody: textBody,
          htmlBody: htmlBody
        })
      });
  
      if (!response.ok) {
        throw new Error(`Failed to send email: ${response.statusText}`);
      }
  
      console.log('Email sent successfully.');
    } catch (error) {
      console.error('Error notifying Maria:', error);
    }
  };
  