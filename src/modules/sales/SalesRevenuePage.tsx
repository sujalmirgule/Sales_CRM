import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { useAuth } from '../../context/AuthContext';
import { SalesRecord } from '../../types/crm';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatCard } from '../../components/common/StatCard';
import { RevenueTrendChart } from '../../components/charts/RevenueTrendChart';
import { exportToCSV } from '../../utils/exportCsv';
import { formatCurrency, formatDateTime, formatDate } from '../../utils/formatters';
import {
  BadgeDollarSign,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Plus,
  Download,
  CreditCard,
  Building,
  User,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const SalesRevenuePage: React.FC = () => {
  const { sales, leads, staffMembers, addSale } = useCRM();
  const { currentUser, isMaster } = useAuth();

  const [isAddSaleOpen, setIsAddSaleOpen] = useState(false);

  // Form state
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || '');
  const [product, setProduct] = useState('3BHK Luxury Highrise');
  const [amount, setAmount] = useState(15000000);
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'partial' | 'pending'>('paid');
  const [assignedStaffId, setAssignedStaffId] = useState(staffMembers[0]?.id || '');
  const [notes, setNotes] = useState('');

  // Metrics
  const totalRevenue = sales.reduce((acc, s) => acc + s.saleAmount, 0);
  const totalConversions = sales.length;
  const avgDealValue = totalConversions > 0 ? Math.round(totalRevenue / totalConversions) : 0;
  const monthlyRevenue = totalRevenue; // current month MTD

  // Staff-wise revenue
  const staffRevenueData = staffMembers.map((staff) => {
    const repSales = sales.filter((s) => s.assignedStaffId === staff.id);
    const rev = repSales.reduce((acc, s) => acc + s.saleAmount, 0);
    return {
      name: staff.name.split(' ')[0],
      fullName: staff.name,
      revenueLakhs: Number((rev / 100000).toFixed(1)),
      conversions: repSales.length,
    };
  });

  const handleAddSaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lead = leads.find((l) => l.id === selectedLeadId);
    const staff = staffMembers.find((s) => s.id === assignedStaffId) || currentUser;
    if (!lead) return;

    addSale({
      leadId: lead.id,
      customerName: lead.customerName,
      phone: lead.phone,
      product: product,
      saleAmount: Number(amount),
      paymentStatus: paymentStatus,
      conversionDate: new Date().toISOString(),
      assignedStaffId: staff.id,
      assignedStaffName: staff.name,
      notes: notes,
    });

    setIsAddSaleOpen(false);
  };

  const handleExportCSV = () => {
    exportToCSV(
      sales,
      'Sales_and_Revenue_Ledger',
      [
        { key: 'invoiceNumber', header: 'Invoice #' },
        { key: 'customerName', header: 'Customer' },
        { key: 'phone', header: 'Phone' },
        { key: 'product', header: 'Property Unit' },
        { key: 'saleAmount', header: 'Amount (INR)', transform: (v) => formatCurrency(v) },
        { key: 'paymentStatus', header: 'Payment Status' },
        { key: 'conversionDate', header: 'Booking Date', transform: (v) => formatDate(v) },
        { key: 'assignedStaffName', header: 'Closing Executive' },
        { key: 'notes', header: 'Notes' },
      ]
    );
  };

  return (
    <div className="space-y-5">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Sales & Revenue Realization</h2>
          <p className="text-xs text-slate-500">
            Track confirmed bookings, transaction invoices, and sales executive deal closures
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="w-3.5 h-3.5 mr-1" /> Export Sales Ledger
          </Button>
          {isMaster && (
            <Button variant="brand" size="sm" onClick={() => setIsAddSaleOpen(true)}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Record New Sale
            </Button>
          )}
        </div>
      </div>

      {/* 4 Sales KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          title="Total Gross Revenue"
          value={formatCurrency(totalRevenue)}
          change="+28% MoM"
          trend="up"
          subtext="Cumulative booking value"
          icon={BadgeDollarSign}
          iconColor="text-emerald-600 bg-emerald-50"
        />
        <StatCard
          title="Current Month (MTD)"
          value={formatCurrency(monthlyRevenue)}
          change="+14% pace"
          trend="up"
          subtext="November 2026 sales"
          icon={TrendingUp}
          iconColor="text-blue-600 bg-blue-50"
        />
        <StatCard
          title="Total Converted Units"
          value={totalConversions}
          change="+6 this mo"
          trend="up"
          subtext="Closed contracts"
          icon={CheckCircle2}
          iconColor="text-indigo-600 bg-indigo-50"
        />
        <StatCard
          title="Average Deal Size"
          value={formatCurrency(avgDealValue)}
          subtext="Average ticket value"
          icon={CreditCard}
          iconColor="text-amber-600 bg-amber-50"
        />
      </div>

      {/* Revenue Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <RevenueTrendChart />
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-800">Staff Contribution to Revenue</h4>
              <p className="text-xs text-slate-500">Deal volume in ₹ Lakhs</p>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={staffRevenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={false} />
                <YAxis
                  tick={{ fontSize: 10, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `₹${v}L`}
                />
                <Tooltip
                  formatter={(val: any) => [`₹${val} Lakhs`, 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderColor: '#334155',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="revenueLakhs" name="Closed Revenue (₹ Lakhs)" fill="#16A34A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Confirmed Sales Ledger Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Closed Transactions & Invoice Register</CardTitle>
            <p className="text-xs text-slate-500">Official sales log with customer agreements and payment stages</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="p-3">Invoice #</th>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Property Unit / Product</th>
                  <th className="p-3">Sale Amount</th>
                  <th className="p-3">Payment Stage</th>
                  <th className="p-3">Conversion Date</th>
                  <th className="p-3">Closing Rep</th>
                  <th className="p-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-brand-600">{sale.invoiceNumber}</td>
                    <td className="p-3 font-bold text-slate-900">{sale.customerName}</td>
                    <td className="p-3 font-mono text-slate-600">{sale.phone}</td>
                    <td className="p-3 text-slate-800 font-medium">{sale.product}</td>
                    <td className="p-3 font-bold text-emerald-600 font-mono">
                      {formatCurrency(sale.saleAmount)}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          sale.paymentStatus === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {sale.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 font-mono">{formatDate(sale.conversionDate)}</td>
                    <td className="p-3 font-semibold text-slate-700">{sale.assignedStaffName}</td>
                    <td className="p-3 text-slate-500 max-w-[200px] truncate" title={sale.notes}>
                      {sale.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Sale Modal */}
      <Modal
        isOpen={isAddSaleOpen}
        onClose={() => setIsAddSaleOpen(false)}
        maxWidth="md"
        title="Record New Property Booking"
      >
        <form onSubmit={handleAddSaleSubmit} className="space-y-3">
          <Select
            label="Converted Lead *"
            value={selectedLeadId}
            onChange={(e) => setSelectedLeadId(e.target.value)}
          >
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.customerName} ({l.phone}) — {l.interestedProduct}
              </option>
            ))}
          </Select>

          <Input
            label="Property / Unit Description *"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            required
          />

          <Input
            label="Total Deal Amount (₹ INR) *"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
          />

          <Select
            label="Payment Status"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value as any)}
          >
            <option value="paid">Fully Disbursed / Cleared</option>
            <option value="partial">Advance Token Received</option>
            <option value="pending">Agreement Under Verification</option>
          </Select>

          <Select
            label="Closing Sales Executive"
            value={assignedStaffId}
            onChange={(e) => setAssignedStaffId(e.target.value)}
          >
            {staffMembers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 block mb-1">
              Transaction Notes
            </label>
            <textarea
              rows={2}
              className="w-full text-xs rounded-md border border-slate-200 p-2 outline-none focus:border-brand-500"
              placeholder="e.g. Bank loan reference number, down payment mode..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddSaleOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="brand" size="sm">
              Confirm & Save Sale
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
