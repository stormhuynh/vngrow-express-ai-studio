import React from 'react';
import { CommissionRecord } from '../../types';
import {
  X,
  FileCheck2,
  Calendar,
  Truck,
  Package,
  Layers,
  DollarSign,
  Scale,
  Printer,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface CreditNoteDetailModalProps {
  commission: CommissionRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CreditNoteDetailModal: React.FC<CreditNoteDetailModalProps> = ({
  commission,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !commission) return null;

  const cost = commission.costDetail || {
    bookingCw: commission.cw,
    actualCw: commission.actualCw || commission.cw,
    bookingPackagesCount: 1,
    actualPackagesCount: 1,
    bookingDimensions: `${commission.cw} kg CW`,
    actualDimensions: `${commission.actualCw || commission.cw} kg CW`,
    baseCost: commission.costPrice ? Math.round(commission.costPrice * 0.9) : 2500000,
    surcharges: 200000,
    incidentalFees: 50000,
    totalCost: commission.costPrice || 2750000,
    salePrice: commission.salePrice,
    grossCommission: Math.round(commission.commissionAmount / 0.9),
    withholdingTax: Math.round((commission.commissionAmount / 0.9) * 0.1),
    netCommission: commission.commissionAmount,
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-sm shadow-sky-200">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">
                  Bảng Kê Chi Tiết Credit Note
                </h2>
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-800 border border-sky-300">
                  {commission.creditNoteNumber || `CN-${commission.id}`}
                </span>
                {commission.status === 'paid' ? (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Đã thanh toán
                  </span>
                ) : (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                    Chờ đối soát
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Vận đơn quốc tế AWB:{' '}
                <span className="font-mono font-bold text-slate-800">
                  {commission.trackingNumber || commission.bookingCode}
                </span>{' '}
                · {commission.carrier || 'Vngrow'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          {/* Timeline đối soát chính sách */}
          <div className="p-3.5 bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-sky-900 font-bold text-xs uppercase tracking-wide">
              <Clock className="w-4 h-4 text-sky-600" />
              <span>Quy trình chu kỳ đối soát & thanh toán hoa hồng</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
              <div className="p-2 bg-white/80 rounded-lg border border-sky-100">
                <span className="font-bold text-sky-800 block text-xs">📅 Ngày 05 hàng tháng</span>
                <span className="text-slate-600">Lên bảng kê đối soát cho các đơn tháng trước</span>
              </div>
              <div className="p-2 bg-white/80 rounded-lg border border-amber-100">
                <span className="font-bold text-amber-800 block text-xs">⚠️ Ngày 10 hàng tháng</span>
                <span className="text-slate-600">Hạn chót kiểm tra & xác nhận khiếu nại đối soát</span>
              </div>
              <div className="p-2 bg-white/80 rounded-lg border border-emerald-100">
                <span className="font-bold text-emerald-800 block text-xs">💰 Ngày 15 hàng tháng</span>
                <span className="text-slate-600">Giải ngân & chuyển khoản hoa hồng thực nhận</span>
              </div>
            </div>
          </div>

          {/* Shipment Key Parameters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 font-bold block mb-0.5">Mã Vận Đơn (AWB)</span>
              <span className="font-mono font-extrabold text-sm text-sky-700 block">
                {commission.trackingNumber || commission.bookingCode}
              </span>
              <span className="text-[10px] text-slate-400">Đơn hàng phát sinh thực tế</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 font-bold block mb-0.5">Khách hàng & Tuyến</span>
              <span className="font-bold text-slate-900 truncate block">{commission.customerName}</span>
              <span className="text-[10px] text-slate-500 font-semibold">{commission.route}</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 font-bold block mb-0.5">Ngày phát sinh bill</span>
              <span className="font-bold text-slate-800 block">{commission.waybillDate || commission.date}</span>
              <span className="text-[10px] text-slate-400">Kỳ đối soát tháng {commission.date.split('/')[1] || '10'}</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 font-bold block mb-0.5">Hãng vận chuyển</span>
              <span className="font-bold text-sky-800 block">{commission.carrier || 'DHL Express'}</span>
              <span className="text-[10px] text-slate-400">Vận tải hàng không Air Freight</span>
            </div>
          </div>

          {/* 1. So sánh Trọng lượng tính phí & Kiện hàng: Booking vs Thực tế */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-1.5 pb-1 border-b border-slate-200">
              <Scale className="w-4 h-4 text-sky-600" />
              <span>1. So sánh thông số kỹ thuật (Booking vs Thực tế cân đo)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Khi Booking */}
              <div className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl space-y-2">
                <div className="font-bold text-slate-700 text-xs flex items-center justify-between pb-1.5 border-b border-slate-200">
                  <span>Thông số khi Booking</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded font-mono">Tạm tính ban đầu</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Trọng lượng tính phí (CW):</span>
                    <span className="font-mono font-bold text-slate-900">{cost.bookingCw} kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Số lượng kiện:</span>
                    <span className="font-bold text-slate-900">{cost.bookingPackagesCount} kiện</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-500">Kích thước booking:</span>
                    <span className="font-mono font-medium text-slate-800 text-right">{cost.bookingDimensions}</span>
                  </div>
                </div>
              </div>

              {/* Thực tế kho cân đo */}
              <div className="p-3.5 bg-sky-50/40 border border-sky-200 rounded-xl space-y-2">
                <div className="font-bold text-sky-900 text-xs flex items-center justify-between pb-1.5 border-b border-sky-200">
                  <span className="flex items-center gap-1 text-emerald-800 font-extrabold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Thực tế kho xác nhận
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono font-bold">
                    Dữ liệu chốt
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Trọng lượng tính phí thực tế:</span>
                    <span className="font-mono font-extrabold text-sm text-rose-600">
                      {cost.actualCw} kg
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Số lượng kiện thực tế:</span>
                    <span className="font-bold text-slate-900">{cost.actualPackagesCount} kiện</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-600">Kích thước sau đóng gói:</span>
                    <span className="font-mono font-semibold text-slate-800 text-right">{cost.actualDimensions}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Bảng phân tích chi phí, giá cost, giá bán và hoa hồng */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-1.5 pb-1 border-b border-slate-200">
              <DollarSign className="w-4 h-4 text-sky-600" />
              <span>2. Phân tích chi phí & Quyết toán hoa hồng CTV</span>
            </h3>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[11px]">
                  <tr>
                    <th className="py-2.5 px-4">Hạng mục tài chính</th>
                    <th className="py-2.5 px-4">Chi tiết / Diễn giải</th>
                    <th className="py-2.5 px-4 text-right">Số tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {/* Base Cost */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-2 px-4 font-semibold text-slate-800">
                      1. Giá cước gốc (Base Cost)
                    </td>
                    <td className="py-2 px-4 text-slate-500">
                      Cước vận chuyển chính theo bảng giá cước gốc Vngrow
                    </td>
                    <td className="py-2 px-4 text-right font-mono font-bold text-slate-800">
                      {cost.baseCost.toLocaleString('vi-VN')} ₫
                    </td>
                  </tr>

                  {/* Surcharges */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-2 px-4 font-semibold text-slate-800">
                      2. Các phụ phí
                    </td>
                    <td className="py-2 px-4 text-slate-500">
                      Phụ phí nhiên liệu (Fuel Surcharge) & Phụ phí theo hãng
                    </td>
                    <td className="py-2 px-4 text-right font-mono font-bold text-slate-800">
                      {cost.surcharges.toLocaleString('vi-VN')} ₫
                    </td>
                  </tr>

                  {/* Incidental fees */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-2 px-4 font-semibold text-slate-800">
                      3. Các khoản phát sinh
                    </td>
                    <td className="py-2 px-4 text-slate-500">
                      Phí gia cố kiện, tem dán hàng pin/đặc biệt, đóng nẹp góc
                    </td>
                    <td className="py-2 px-4 text-right font-mono font-bold text-slate-800">
                      {cost.incidentalFees.toLocaleString('vi-VN')} ₫
                    </td>
                  </tr>

                  {/* Total Cost */}
                  <tr className="bg-amber-50/60 font-bold border-y border-amber-200">
                    <td className="py-2.5 px-4 text-amber-900 uppercase">
                      ➔ TỔNG GIÁ VỐN VNGROW
                    </td>
                    <td className="py-2.5 px-4 text-amber-800 text-[11px]">
                      Giá vốn đầu vào (gồm các chi phí phát sinh) Vngrow cung cấp cho CTV
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-extrabold text-sm text-amber-900">
                      {cost.totalCost.toLocaleString('vi-VN')} ₫
                    </td>
                  </tr>

                  {/* Sale Price */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-4 font-bold text-slate-900">
                      4. Giá bán thu khách
                    </td>
                    <td className="py-2.5 px-4 text-slate-500">
                      Tổng tiền cước đã báo và thu từ khách hàng
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-extrabold text-sm text-sky-700">
                      {cost.salePrice.toLocaleString('vi-VN')} ₫
                    </td>
                  </tr>

                  {/* Gross Commission */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-2 px-4 font-semibold text-slate-800">
                      5. Hoa hồng gộp tạm tính
                    </td>
                    <td className="py-2 px-4 text-slate-500">
                      Lợi nhuận theo hạng CTV trước thuế
                    </td>
                    <td className="py-2 px-4 text-right font-mono font-bold text-slate-800">
                      +{cost.grossCommission.toLocaleString('vi-VN')} ₫
                    </td>
                  </tr>

                  {/* Withholding Tax 10% */}
                  <tr className="hover:bg-rose-50/30 text-rose-700">
                    <td className="py-2 px-4 font-semibold flex items-center gap-1">
                      <span>6. Thuế TNCN tạm thu 10%</span>
                    </td>
                    <td className="py-2 px-4 text-rose-600 text-[11px]">
                      Khấu trừ tạm thu 10% theo quy định thuế TNCN CTV
                    </td>
                    <td className="py-2 px-4 text-right font-mono font-bold text-rose-600">
                      -{cost.withholdingTax.toLocaleString('vi-VN')} ₫
                    </td>
                  </tr>

                  {/* Net Commission */}
                  <tr className="bg-emerald-50/80 border-t-2 border-emerald-300 font-extrabold">
                    <td className="py-3 px-4 text-emerald-950 uppercase text-xs">
                      🏆 SỐ TIỀN THỰC NHẬN CỦA CTV
                    </td>
                    <td className="py-3 px-4 text-emerald-800 text-[11px]">
                      Số tiền thực tế chuyển khoản vào tài khoản ngân hàng của CTV
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-base text-emerald-700">
                      {cost.netCommission.toLocaleString('vi-VN')} ₫
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Credit Note đã được kiểm duyệt số đo và đối soát chi phí hợp lệ</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" /> In Credit Note
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors shadow-2xs"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
