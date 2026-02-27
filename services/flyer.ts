import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import type { LostReport } from '../types';

function buildFlyerHtml(report: LostReport): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    body { font-family: Arial, sans-serif; text-align: center; padding: 24px; }
    h1 { color: #e74c3c; font-size: 48px; margin-bottom: 8px; }
    h2 { font-size: 32px; margin: 0 0 16px; }
    img { width: 280px; height: 280px; object-fit: cover; border-radius: 8px; }
    .info { margin-top: 16px; font-size: 18px; line-height: 1.6; }
    .contact { margin-top: 24px; font-size: 22px; font-weight: bold; color: #2c3e50; }
    .reward { margin-top: 12px; font-size: 20px; color: #27ae60; }
  </style>
</head>
<body>
  <h1>LOST DOG</h1>
  <h2>${report.dogName}</h2>
  <img src="${report.dogPhotoURL}" alt="${report.dogName}" />
  <div class="info">
    <p><strong>Breed:</strong> ${report.dogBreed}</p>
    <p>${report.dogDescription}</p>
    <p><strong>Last seen:</strong> ${report.lastSeenAddress}</p>
    <p><strong>Date:</strong> ${new Date(report.lastSeenAt).toLocaleDateString()}</p>
  </div>
  ${report.rewardOffered ? `<div class="reward">Reward: $${report.rewardAmount ?? '?'}</div>` : ''}
  <div class="contact">Please call: ${report.contactPhone}</div>
</body>
</html>`;
}

export async function printLostFlyer(report: LostReport): Promise<void> {
  const html = buildFlyerHtml(report);
  await Print.printAsync({ html });
}

export async function shareLostFlyer(report: LostReport): Promise<void> {
  const html = buildFlyerHtml(report);
  const { uri } = await Print.printToFileAsync({ html });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
  }
}
