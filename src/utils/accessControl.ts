import { Lead, PaymentStatus } from '../types';

export interface AccessValidity {
  paymentStatus: PaymentStatus;
  paidDate?: string;
  hasPaid: boolean;
  isExpired: boolean;
  isActive: boolean;
  daysRemaining: number;
  expiryDateString: string;
  formattedPaidDate: string;
}

export const ONE_MONTH_DAYS = 30;

/**
 * Calculates 1-month access validity based on paidDate and paymentStatus.
 */
export function checkCourseAccess(paymentStatus: PaymentStatus, paidDate?: string): AccessValidity {
  if (paymentStatus !== 'PAID' || !paidDate) {
    return {
      paymentStatus: 'UNPAID',
      paidDate,
      hasPaid: false,
      isExpired: false,
      isActive: false,
      daysRemaining: 0,
      expiryDateString: 'N/A (Payment Required)',
      formattedPaidDate: 'Not Paid'
    };
  }

  const paidDateTime = new Date(paidDate).getTime();
  const expiryDateTime = paidDateTime + ONE_MONTH_DAYS * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const msRemaining = expiryDateTime - now;
  const daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));
  const isExpired = daysRemaining <= 0;

  const expiryDateObj = new Date(expiryDateTime);
  const expiryDateString = expiryDateObj.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const paidDateObj = new Date(paidDate);
  const formattedPaidDate = paidDateObj.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return {
    paymentStatus: 'PAID',
    paidDate,
    hasPaid: true,
    isExpired,
    isActive: !isExpired,
    daysRemaining: isExpired ? 0 : daysRemaining,
    expiryDateString,
    formattedPaidDate
  };
}

/**
 * Finds matching admission record for a student by email or name.
 */
export function findStudentAdmission(leads: Lead[], studentEmail?: string, studentName?: string): Lead | undefined {
  if (!leads || leads.length === 0) return undefined;
  
  if (studentEmail) {
    const matchByEmail = leads.find(l => l.email.toLowerCase() === studentEmail.toLowerCase());
    if (matchByEmail) return matchByEmail;
  }
  
  if (studentName) {
    const matchByName = leads.find(l => l.studentName.toLowerCase().includes(studentName.toLowerCase()));
    if (matchByName) return matchByName;
  }
  
  // Default to first enrolled lead if student matches loosely
  return leads.find(l => l.status === 'ENROLLED');
}
