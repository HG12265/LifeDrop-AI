// src/utils/DownloadIDCard.js
import { toast } from 'sonner';

export const downloadProfessionalIDCard = (qrElementId, titleText) => {
  const qrCanvas = document.getElementById(qrElementId);
  if (!qrCanvas) {
    toast.error("QR Code not found!");
    return;
  }

  // Create an off-screen canvas for the ID Card
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  
  // High Resolution Size
  const width = 800;
  const height = 1200;
  canvas.width = width;
  canvas.height = height;

  // 1. Premium Background (Deep Slate)
  ctx.fillStyle = "#020617"; // slate-950
  ctx.fillRect(0, 0, width, height);

  // Add subtle glowing radial gradients
  const topGlow = ctx.createRadialGradient(width/2, 0, 0, width/2, 0, 600);
  topGlow.addColorStop(0, "rgba(220, 38, 38, 0.2)"); // Red glow
  topGlow.addColorStop(1, "transparent");
  ctx.fillStyle = topGlow;
  ctx.fillRect(0, 0, width, height);

  const bottomGlow = ctx.createRadialGradient(width/2, height, 0, width/2, height, 600);
  bottomGlow.addColorStop(0, "rgba(30, 64, 175, 0.15)"); // Blueish glow
  bottomGlow.addColorStop(1, "transparent");
  ctx.fillStyle = bottomGlow;
  ctx.fillRect(0, 0, width, height);

  // 2. Main ID Card Frame (Glassmorphism look)
  const cardX = 60;
  const cardY = 220;
  const cardW = width - 120;
  const cardH = height - 320;
  const cardRadius = 40;

  ctx.fillStyle = "#0f172a"; // slate-900
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"; // Subtle border
  ctx.lineWidth = 2;
  
  // Draw Rounded Rect for Card
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, cardRadius);
  ctx.fill();
  ctx.stroke();

  // Highlight line at top of card
  ctx.beginPath();
  ctx.moveTo(cardX + cardRadius, cardY);
  ctx.lineTo(cardX + cardW - cardRadius, cardY);
  ctx.strokeStyle = "rgba(239, 68, 68, 0.8)"; // Red accent line
  ctx.lineWidth = 4;
  ctx.stroke();

  // 3. Header Logo & Verification System
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 70px Arial";
  ctx.textAlign = "center";
  ctx.fillText("LifeDrop", width / 2, 110);
  
  ctx.fillStyle = "#ef4444"; // red-500
  ctx.font = "bold 20px Arial";
  ctx.letterSpacing = "6px"; 
  ctx.fillText("DIGITAL VERIFICATION SYSTEM", width / 2, 150);

  // 4. Dynamic Role Text (Handling long alignment using line breaks)
  ctx.fillStyle = "#f87171"; // red-400
  ctx.font = "bold 28px Arial";
  ctx.textAlign = "center";
  if (titleText.length > 30) {
      // Split into two lines
      const words = titleText.split(" ");
      const mid = Math.floor(words.length / 2);
      ctx.fillText(words.slice(0, mid).join(" ").toUpperCase(), width / 2, cardY + 80);
      ctx.fillText(words.slice(mid).join(" ").toUpperCase(), width / 2, cardY + 125);
  } else {
      ctx.fillText(titleText.toUpperCase(), width / 2, cardY + 100);
  }

  // Divider
  ctx.beginPath();
  ctx.moveTo(cardX + 100, cardY + 170);
  ctx.lineTo(cardX + cardW - 100, cardY + 170);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // 5. Draw QR Code Container (White Rounded Rectangle)
  const qrBoxSize = 420;
  const qrBoxX = (width - qrBoxSize) / 2;
  const qrBoxY = cardY + 220;
  
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 20;
  
  ctx.beginPath();
  ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 24);
  ctx.fill();

  // Reset shadow for QR
  ctx.shadowColor = "transparent";

  // 6. Draw the actual QR Code inside the container
  const qrPadding = 25;
  const targetQrSize = qrBoxSize - (qrPadding * 2);
  ctx.drawImage(qrCanvas, qrBoxX + qrPadding, qrBoxY + qrPadding, targetQrSize, targetQrSize);

  // 7. Security Footers inside Card
  ctx.fillStyle = "#94a3b8"; // slate-400
  ctx.font = "bold 16px Arial";
  ctx.fillText("SCAN TO VERIFY INTEGRITY", width / 2, qrBoxY + qrBoxSize + 60);

  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.font = "bold 12px Arial";
  
  const dateStr = new Date().toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
  }).toUpperCase();
  ctx.fillText(`GENERATED: ${dateStr}`, width / 2, qrBoxY + qrBoxSize + 90);

  // 8. Global Footer Text (Cleaned up, removed URL)
  ctx.fillStyle = "rgba(148, 163, 184, 0.8)"; // slate-400 opacity
  ctx.font = "bold 18px Arial";
  ctx.letterSpacing = "2px";
  ctx.fillText("SECURE HEALTHCARE RECORD • LIFEDROP AI", width / 2, height - 50);

  // 9. Trigger Download
  try {
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `LifeDrop_ID_${Date.now()}.png`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Professional ID Card Downloaded!");
  } catch (err) {
    console.error("Export Error:", err);
    toast.error("Failed to download image.");
  }
};
