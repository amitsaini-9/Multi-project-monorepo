// Email templates for different apps

interface BaseEmailTemplate {
  subject: string
  html: string
  text: string
}

// CRM - Follow-up reminder
export function crmFollowUpReminder(contactName: string, notes?: string): BaseEmailTemplate {
  return {
    subject: `Reminder: Follow up with ${contactName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Follow-up Reminder</h2>
        <p>This is a reminder to follow up with <strong>${contactName}</strong>.</p>
        ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
        <p>Login to your CRM to update the interaction: <a href="https://crm.sainiamit.com">crm.sainiamit.com</a></p>
      </div>
    `,
    text: `Follow-up Reminder\n\nThis is a reminder to follow up with ${contactName}.\n${notes ? `\nNotes: ${notes}` : ''}\n\nLogin to your CRM: https://crm.sainiamit.com`
  }
}

// DNS Monitor - Change alert
export function dnsChangeAlert(domain: string, recordType: string, oldValues: string[], newValues: string[]): BaseEmailTemplate {
  return {
    subject: `🚨 DNS Change Detected: ${domain}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">DNS Change Alert</h2>
        <p>DNS records have changed for <strong>${domain}</strong></p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <th style="text-align: left; padding: 10px; background: #f3f4f6;">Record Type</th>
            <td style="padding: 10px;">${recordType}</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 10px; background: #f3f4f6;">Old Values</th>
            <td style="padding: 10px;">${oldValues.join(', ')}</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 10px; background: #f3f4f6;">New Values</th>
            <td style="padding: 10px; color: #dc2626;">${newValues.join(', ')}</td>
          </tr>
        </table>
        <p><a href="https://dns.sainiamit.com">View full history →</a></p>
      </div>
    `,
    text: `DNS Change Alert\n\nDNS records changed for ${domain}\n\nRecord Type: ${recordType}\nOld Values: ${oldValues.join(', ')}\nNew Values: ${newValues.join(', ')}\n\nView history: https://dns.sainiamit.com`
  }
}

// API Monitor - Downtime alert
export function apiDowntimeAlert(apiName: string, url: string, errorMessage?: string): BaseEmailTemplate {
  return {
    subject: `🔴 API Down: ${apiName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">API Downtime Alert</h2>
        <p><strong>${apiName}</strong> is currently unreachable.</p>
        <p><strong>URL:</strong> ${url}</p>
        ${errorMessage ? `<p><strong>Error:</strong> ${errorMessage}</p>` : ''}
        <p><a href="https://api-monitor.sainiamit.com">View dashboard →</a></p>
      </div>
    `,
    text: `API Downtime Alert\n\n${apiName} is currently unreachable.\n\nURL: ${url}\n${errorMessage ? `\nError: ${errorMessage}` : ''}\n\nView dashboard: https://api-monitor.sainiamit.com`
  }
}

// API Monitor - Recovery alert
export function apiRecoveryAlert(apiName: string, url: string, downtimeDuration: string): BaseEmailTemplate {
  return {
    subject: `✅ API Recovered: ${apiName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">API Recovered</h2>
        <p><strong>${apiName}</strong> is back online.</p>
        <p><strong>URL:</strong> ${url}</p>
        <p><strong>Downtime:</strong> ${downtimeDuration}</p>
        <p><a href="https://api-monitor.sainiamit.com">View dashboard →</a></p>
      </div>
    `,
    text: `API Recovered\n\n${apiName} is back online.\n\nURL: ${url}\nDowntime: ${downtimeDuration}\n\nView dashboard: https://api-monitor.sainiamit.com`
  }
}

// Booking Widget - Confirmation
export function bookingConfirmation(
  customerName: string,
  serviceName: string,
  dateTime: string,
  duration: number,
  price: string
): BaseEmailTemplate {
  return {
    subject: `Booking Confirmed: ${serviceName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Booking Confirmation</h2>
        <p>Hi ${customerName},</p>
        <p>Your booking has been confirmed!</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <th style="text-align: left; padding: 10px; background: #f3f4f6;">Service</th>
            <td style="padding: 10px;">${serviceName}</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 10px; background: #f3f4f6;">Date & Time</th>
            <td style="padding: 10px;">${dateTime}</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 10px; background: #f3f4f6;">Duration</th>
            <td style="padding: 10px;">${duration} minutes</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 10px; background: #f3f4f6;">Price</th>
            <td style="padding: 10px;">${price}</td>
          </tr>
        </table>
        <p>If you need to reschedule or cancel, please contact us at support@sainiamit.com</p>
      </div>
    `,
    text: `Booking Confirmation\n\nHi ${customerName},\n\nYour booking has been confirmed!\n\nService: ${serviceName}\nDate & Time: ${dateTime}\nDuration: ${duration} minutes\nPrice: ${price}\n\nContact: support@sainiamit.com`
  }
}

// Team Availability - Status change notification
export function teamStatusNotification(
  memberName: string,
  date: string,
  status: string,
  teamName: string
): BaseEmailTemplate {
  const statusEmoji = {
    office: '🏢',
    wfh: '🏠',
    ooo: '✈️',
    sick: '🤒'
  }[status] || '📍'

  return {
    subject: `${statusEmoji} ${memberName} - ${status.toUpperCase()} on ${date}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>${statusEmoji} Team Status Update</h2>
        <p><strong>${memberName}</strong> updated their status for ${date}:</p>
        <p style="font-size: 18px; padding: 15px; background: #f3f4f6; border-radius: 8px;">
          ${status.toUpperCase()}
        </p>
        <p>Team: <strong>${teamName}</strong></p>
        <p><a href="https://team.sainiamit.com">View team dashboard →</a></p>
      </div>
    `,
    text: `Team Status Update\n\n${memberName} updated their status for ${date}: ${status.toUpperCase()}\n\nTeam: ${teamName}\n\nView dashboard: https://team.sainiamit.com`
  }
}

// Budget Tracker - Monthly summary
export function budgetMonthlySummary(
  month: string,
  totalSpent: string,
  topCategories: Array<{ category: string; amount: string }>
): BaseEmailTemplate {
  const categoriesHtml = topCategories
    .map(c => `<li>${c.category}: ${c.amount}</li>`)
    .join('')

  return {
    subject: `💰 Your ${month} Budget Summary`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Budget Summary - ${month}</h2>
        <p><strong>Total Spent:</strong> ${totalSpent}</p>
        <h3>Top Categories</h3>
        <ul>${categoriesHtml}</ul>
        <p><a href="https://budget.sainiamit.com">View detailed report →</a></p>
      </div>
    `,
    text: `Budget Summary - ${month}\n\nTotal Spent: ${totalSpent}\n\nTop Categories:\n${topCategories.map(c => `- ${c.category}: ${c.amount}`).join('\n')}\n\nView report: https://budget.sainiamit.com`
  }
}

// Kindle Sender - Article sent confirmation
export function articleSentToKindle(title: string, author?: string): BaseEmailTemplate {
  return {
    subject: `📚 Article sent to your Kindle: ${title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>📚 Article Sent to Kindle</h2>
        <p><strong>${title}</strong> has been sent to your Kindle.</p>
        ${author ? `<p>By ${author}</p>` : ''}
        <p>It should appear on your device shortly.</p>
        <p><a href="https://kindle.sainiamit.com">Manage your queue →</a></p>
      </div>
    `,
    text: `Article Sent to Kindle\n\n${title}\n${author ? `By ${author}\n` : ''}\nIt should appear on your device shortly.\n\nManage queue: https://kindle.sainiamit.com`
  }
}
