// pdfGenerator.js

import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generatePDF = async (realTimeQuote, selectedTab, formatFieldName) => {
  const pdf = new jsPDF('p', 'pt', 'a4');
  const pageHeight = pdf.internal.pageSize.height;
  const pageWidth = pdf.internal.pageSize.width;

  

  const addImageToPDF = async (pdf, imgSrc, x, y, maxWidth, maxHeight) => {
    return new Promise((resolve, reject) => {
      if (imgSrc) {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imgSrc;
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          const aspectRatio = width / height;

          if (height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
          }

          if (width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
          }

          pdf.addImage(img, 'PNG', x, y, width, height);
          resolve();
        };
        img.onerror = (error) => {
          console.error(`Error loading image ${imgSrc}:`, error);
          reject(error);
        };
      } else {
        resolve();
      }
    });
  };

  try {
    if (!realTimeQuote || !realTimeQuote.products) {
      console.error('Quote data is missing or incomplete');
      return;
    }

    const filteredProducts = realTimeQuote.products.filter(product => product.productType === selectedTab);

    for (let productIndex = 0; productIndex < filteredProducts.length; productIndex++) {
      const product = filteredProducts[productIndex];

      if (productIndex > 0) {
        pdf.addPage();
      }

      // Product Header
      pdf.setFontSize(20);
      pdf.setFont(undefined, 'bold');
      pdf.text(`Product ${productIndex + 1}: ${product.productType || ''}`, 40, 100);

      // Basic Details Table
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'normal');
      pdf.autoTable({
        startY: 120,
        head: [['Field', 'Value']],
        body: [
          ['Customer Name', realTimeQuote.customerName || ''],
          ['Sales Rep Name', realTimeQuote.salesRepName || ''],
          ['Project Name', realTimeQuote.projectName || ''],
          ['Project ID', realTimeQuote.projectId || ''],
        ],
        theme: 'grid',
        styles: { fontSize: 10 },
      });

      // Special Instructions
      const specialShippingY = pdf.lastAutoTable.finalY + 25;
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(255, 0, 0);
      pdf.text('Special Instructions:', 40, specialShippingY);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont(undefined, 'normal');
      pdf.text(product.packagingInstructions || '', 150, specialShippingY);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(255, 0, 0);
      pdf.text('Shipping Instructions:', 40, specialShippingY + 20);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont(undefined, 'normal');
      pdf.text(product.shippingInstructions || '', 150, specialShippingY + 20);

      // Product Fields Table
      const fieldsTableYStart = specialShippingY + 60;
      const productFields = Object.entries(product.fields || {})
        .filter(([key]) => key !== 'bottleImage' && key !== 'artwork')
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([key, value]) => {
          const formattedName = formatFieldName(key);
          const displayValue = typeof value === 'object' && value !== null
            ? `Width: ${value.width} x Height ${value.height} x Length ${value.length} x Gusset ${value.gusset} x Depth ${value.depth}`
            : value;
          return [formattedName, displayValue || ''];
        });

      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text('Product Fields', 40, fieldsTableYStart - 10);
      pdf.setFont(undefined, 'normal');
      pdf.autoTable({
        startY: fieldsTableYStart,
        head: [['Field', 'Value']],
        body: productFields,
        theme: 'grid',
        styles: { fontSize: 10 },
      });

      // Quantities Table
      const quantitiesTableYStart = pdf.lastAutoTable.finalY + 20;
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text('Quantities', 40, quantitiesTableYStart);
      pdf.setFont(undefined, 'normal');

      const quantityHeaders = ['SKU', ...product.skuDetails[0].quantities.map((_, i) => `Quantity ${i + 1}`)];
      const quantityBody = product.skuDetails.map((skuDetail) => [
        skuDetail.sku,
        ...skuDetail.quantities.map(qty => qty.value)
      ]);

      pdf.autoTable({
        startY: quantitiesTableYStart + 10,
        head: [quantityHeaders],
        body: quantityBody,
        theme: 'grid',
        styles: { fontSize: 10 },
      });

      // Prices Table
      const pricesTableYStart = pdf.lastAutoTable.finalY + 20;
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text('Prices', 40, pricesTableYStart);
      pdf.setFont(undefined, 'normal');

      const pricesHeaders = ['SKU', 'Q1 Price', 'Q2 Price', 'Q3 Price'];
      const pricesBody = product.skuDetails.map((skuDetail) => [
        skuDetail.sku,
        '', '', '' // Replace with actual price data if available
      ]);

      pdf.autoTable({
        startY: pricesTableYStart + 10,
        head: [pricesHeaders],
        body: pricesBody,
        theme: 'grid',
        styles: { fontSize: 10 },
      });

      // Shipping Dimensions Table
      const shippingDimensionsTableYStart = pdf.lastAutoTable.finalY + 20;
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text('Shipping Dimensions', 40, shippingDimensionsTableYStart);
      pdf.setFont(undefined, 'normal');

      const shippingDimensionsHeaders = ['SKU', 'Q1 Shipping Dimensions', 'Q2 Shipping Dimensions', 'Q3 Shipping Dimensions'];
      const shippingDimensionsBody = product.skuDetails.map((skuDetail) => [
        skuDetail.sku,
        '', '', '' // Replace with actual dimension data if available
      ]);

      pdf.autoTable({
        startY: shippingDimensionsTableYStart + 10,
        head: [shippingDimensionsHeaders],
        body: shippingDimensionsBody,
        theme: 'grid',
        styles: { fontSize: 10 },
      });

      // Air/Sea Shipping Quantities Table
      const airSeaQuantitiesTableYStart = pdf.lastAutoTable.finalY + 20;
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text('Air/Sea Shipping Quantities', 40, airSeaQuantitiesTableYStart);
      pdf.setFont(undefined, 'normal');

      const airSeaQuantitiesHeaders = ['SKU', 'Express Air Qty', 'Regular Air Qty', 'Regular Sea Container Qty', 'Express Sea Container Qty'];
      const airSeaQuantitiesBody = product.skuDetails.map((skuDetail) => [
        skuDetail.sku,
        '', '', '', '' // Replace with actual shipping quantity data if available
      ]);

      pdf.autoTable({
        startY: airSeaQuantitiesTableYStart + 10,
        head: [airSeaQuantitiesHeaders],
        body: airSeaQuantitiesBody,
        theme: 'grid',
        styles: { fontSize: 10 },
      });

      // Air/Sea Shipping Prices Table
      const airSeaPricesTableYStart = pdf.lastAutoTable.finalY + 20;
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text('Air/Sea Shipping Prices', 40, airSeaPricesTableYStart);
      pdf.setFont(undefined, 'normal');

      const airSeaPricesHeaders = ['SKU', 'Express Air Price', 'Regular Air Price', 'Regular Sea Container Price', 'Express Sea Container Price'];
      const airSeaPricesBody = product.skuDetails.map((skuDetail) => [
        skuDetail.sku,
        '', '', '', '' // Replace with actual shipping price data if available
      ]);

      pdf.autoTable({
        startY: airSeaPricesTableYStart + 10,
        head: [airSeaPricesHeaders],
        body: airSeaPricesBody,
        theme: 'grid',
        styles: { fontSize: 10 },
      });

      // Shipping Details Table
      const shippingDetailsYStart = pdf.lastAutoTable.finalY + 40;
      const shippingDetails = [
        { label: 'Commodity Type', value: '' },
        { label: 'From Shipping Address', value: '' },
        { label: 'Split Shipping With Breakdown', value: '' },
        { label: 'Palletize', value: '' },
        { label: 'Special Notes', value: product.shippingInstructions || '' },
        { label: 'Total Units Per Commodity', value: '' },
        { label: 'Number Of Units Per Box', value: '' },
        { label: 'Total Number Of Boxes Per Commodity', value: '' },
        { label: 'Ship Box Dimensions', value: '' },
        { label: 'Ship Weight Per Box', value: '' },
        { label: 'Total Qty Of Boxes Per Commodity', value: '' },
        { label: 'Shipping Volume Per Product', value: '' },
        { label: 'Total Volume For The Whole Order', value: '' }
      ];

      const shippingDetailsBody = shippingDetails.map(detail => [detail.label, detail.value]);
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text('Shipping Details', 40, shippingDetailsYStart);
      pdf.setFont(undefined, 'normal');
      pdf.autoTable({
        startY: shippingDetailsYStart + 10,
        head: [['Field', 'Value']],
        body: shippingDetailsBody,
        theme: 'grid',
        styles: { fontSize: 10 },
        columnStyles: {
          0: { cellWidth: 0.5 * pageWidth - 40 },
          1: { cellWidth: 0.5 * pageWidth - 40 }
        },
      });
    }

    pdf.save(`quote-details - ${selectedTab} - (${realTimeQuote.projectId}).pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
