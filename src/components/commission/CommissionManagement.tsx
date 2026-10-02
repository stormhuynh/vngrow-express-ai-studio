import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { CommissionRecord } from '../../types';
import { CreditNoteDetailModal } from './CreditNoteDetailModal';
import {
  Wallet,
  Download,
  Calendar,
  CheckCircle,
  Clock,
  ArrowUpRight,
  CreditCard,
  Building,
  FileCheck2,
  AlertCircle,
  Info,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const CommissionManagement: React.FC = () => {
  const {
    role,
    activeCollaborator,
    visibleCommissions,
    collaborators,
    approveCommissionPayment,
    payAllCtvCommission,
  } = useLogistics();

  const [selectedCommission, setSelectedCommission] = useState<CommissionRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'credit_notes' | 'ctv_payout'>('credit_notes');

  // Metrics for CTV
  const ctvTotalCommission = visibleCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);
  const ctvPendingCommission = visibleCommissions
    .filter((c) => c.status === 'pending_audit')
    .reduce((sum, c) => sum + c.commissionAmount, 0);
  const ctvPaidCommission = visibleCommissions
    .filter((c) => c.status === 'paid')
    .reduce((sum, c) => sum + c.commissionAmount, 0);

  // Metrics for NV
  const nvTotalSystemCommission = collaborators.reduce((sum, c) => sum + c.totalCommission, 0);
  const nvTotalPendingCommission = collaborators.reduce((sum, c) => sum + c.pendingCommission, 0);
  const nvTotalPaidCommission = collaborators.reduce((sum, c) => sum + c.paidCommission, 0);

  const exportExcel = () => {
    const headers =
      'Credit Note,Tracking,Ngày,Khách hàng,Lộ trình,Trọng lượng tính phí (kg),Giá vốn (đ),Giá bán (đ),Thuế TNCN 10% (đ),Hoa hồng thực nhận (đ),Trạng thái\n';
    const rows = visibleCommissions
      .map((c) => {
        const costVal = c.costPrice || (c.costDetail?.totalCost) || Math.round(c.salePrice * 0.75);
        const taxVal = c.costDetail?.withholdingTax || Math.round((c.commissionAmount / 0.9) * 0.1);
        return `"${c.creditNoteNumber || `CN-${c.id}`}","${c.trackingNumber || c.bookingCode}","${c.waybillDate || c.date}","${c.customerName}","${c.route}",${c.cw},${costVal},${c.salePrice},${taxVal},${c.commissionAmount},"${c.status === 'paid' ? 'Đã thanh toán' : 'Chờ đối soát'}"`;
      })
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Vngrow_Hoa_Hong_CreditNote_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Policy Schedule Notice: Lịch đối soát cố định của Vngrow */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-900 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-sky-500/30 border border-sky-400/30 text-sky-200 text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              Lịch Trình Đối Soát & Quyết Toán Hoa Hồng
            </div>
            <h2 className="text-lg font-black tracking-tight text-white">
              Chu Kỳ Lên Bảng Kê & Thanh Toán Hoa Hồng Định Kỳ
            </h2>
            <p className="text-xs text-sky-200 max-w-2xl">
              Áp dụng thống nhất cho toàn bộ mạng lưới Cộng Tác Viên (CTV) dựa trên số liệu vận đơn thực tế đã phát sinh.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={exportExcel}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold border border-white/20 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-4 h-4" /> Xuất Bảng Kê Excel
            </button>
          </div>
        </div>

        {/* 3 Step Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/10 text-xs">
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-400/20 text-sky-300 font-extrabold flex items-center justify-center shrink-0 text-sm">
              05
            </div>
            <div>
              <span className="font-extrabold text-white block">Ngày 05 hàng tháng</span>
              <span className="text-sky-200 text-[11px] block mt-0.5">
                Kế toán Vngrow lên bảng kê đối soát cho toàn bộ vận đơn tháng trước.
              </span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 font-extrabold flex items-center justify-center shrink-0 text-sm">
              10
            </div>
            <div>
              <span className="font-extrabold text-white block">Ngày 10 hàng tháng</span>
              <span className="text-sky-200 text-[11px] block mt-0.5">
                Hết hạn đối soát. CTV kiểm tra số liệu, xác nhận số dư hoặc phản hồi khiếu nại.
              </span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-400/20 text-emerald-300 font-extrabold flex items-center justify-center shrink-0 text-sm">
              15
            </div>
            <div>
              <span className="font-extrabold text-white block">Ngày 15 hàng tháng</span>
              <span className="text-sky-200 text-[11px] block mt-0.5">
                Vngrow thực hiện thanh toán, chuyển khoản hoa hồng thực nhận vào tài khoản ngân hàng.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CTV METRICS VIEW ================= */}
      {role === 'ctv' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Tổng Hoa Hồng Lũy Kế
            </div>
            <div className="text-2xl font-extrabold text-sky-700 font-mono tabular-nums">
              {ctvTotalCommission.toLocaleString('vi-VN')}{' '}
              <span className="text-sm font-sans font-normal text-slate-500">₫</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">Từ các vận đơn quốc tế đã tạo</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
              Chưa Đối Soát (Kỳ Này)
            </div>
            <div className="text-2xl font-extrabold text-amber-600 font-mono tabular-nums">
              {ctvPendingCommission.toLocaleString('vi-VN')}{' '}
              <span className="text-sm font-sans font-normal text-slate-500">₫</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">Sẽ quyết toán vào ngày 15 tháng tới</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
              Đã Thanh Toán Thành Công
            </div>
            <div className="text-2xl font-extrabold text-emerald-600 font-mono tabular-nums">
              {ctvPaidCommission.toLocaleString('vi-VN')}{' '}
              <span className="text-sm font-sans font-normal text-slate-500">₫</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">Đã giải ngân qua tài khoản ngân hàng</div>
          </div>
        </div>
      )}

      {/* ================= NV / ADMIN METRICS VIEW ================= */}
      {role === 'nv' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Tổng Hoa Hồng Toàn Mạng Lưới CTV
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                {nvTotalSystemCommission.toLocaleString('vi-VN')}{' '}
                <span className="text-sm font-sans font-normal text-slate-500">₫</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">Lũy kế các vận đơn đã phát sinh</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
                Hoa Hồng Cần Duyệt Chi Kỳ Này
              </div>
              <div className="text-2xl font-extrabold text-amber-600 font-mono tabular-nums">
                {nvTotalPendingCommission.toLocaleString('vi-VN')}{' '}
                <span className="text-sm font-sans font-normal text-slate-500">₫</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">Hết hạn đối soát ngày 10, thanh toán ngày 15</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                Đã Giải Ngân Cho CTV
              </div>
              <div className="text-2xl font-extrabold text-emerald-600 font-mono tabular-nums">
                {nvTotalPaidCommission.toLocaleString('vi-VN')}{' '}
                <span className="text-sm font-sans font-normal text-slate-500">₫</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">Đã chuyển khoản thành công</div>
            </div>
          </div>

          {/* Navigation tabs for Admin */}
          <div className="flex items-center gap-2 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('credit_notes')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'credit_notes'
                  ? 'border-sky-600 text-sky-700 bg-sky-50/50 rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileCheck2 className="w-4 h-4" /> Bảng Kê Chi Tiết Credit Note Từng Vận Đơn
            </button>
            <button
              onClick={() => setActiveTab('ctv_payout')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'ctv_payout'
                  ? 'border-sky-600 text-sky-700 bg-sky-50/50 rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <CreditCard className="w-4 h-4" /> Tổng Hợp Quyết Toán Theo Từng CTV
            </button>
          </div>
        </div>
      )}

      {/* ================= CREDIT NOTES TABLE (CTV & NV) ================= */}
      {(role === 'ctv' || activeTab === 'credit_notes') && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <span>Bảng kê Credit Note</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                {visibleCommissions.length}
              </span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[1050px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 min-w-[140px]">Credit Note</th>
                  <th className="py-3 px-4 min-w-[180px]">Tracking</th>
                  <th className="py-3 px-4 min-w-[190px]">Khách hàng & Tuyến</th>
                  <th className="py-3 px-4 min-w-[130px] text-center whitespace-nowrap">
                    <div>Trọng lượng</div>
                    <div>tính phí</div>
                  </th>
                  <th className="py-3 px-4 min-w-[120px] text-right whitespace-nowrap">Giá vốn</th>
                  <th className="py-3 px-4 min-w-[120px] text-right whitespace-nowrap">Giá bán</th>
                  <th className="py-3 px-4 min-w-[140px] text-right">Hoa hồng thực nhận</th>
                  <th className="py-3 px-4 min-w-[130px] text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleCommissions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      Chưa có dữ liệu hoa hồng / credit note nào.
                    </td>
                  </tr>
                ) : (
                  visibleCommissions.map((comm) => {
                    const costVal =
                      comm.costPrice ||
                      comm.costDetail?.totalCost ||
                      Math.round(comm.salePrice * 0.75);

                    return (
                      <tr key={comm.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* 1. Credit Note - Bấm vào xem chi tiết */}
                        <td className="py-3.5 px-4 font-mono">
                          <button
                            onClick={() => setSelectedCommission(comm)}
                            className="text-xs font-bold text-sky-700 hover:text-sky-900 hover:underline flex items-center gap-1 group text-left"
                            title="Bấm để xem chi tiết chi phí và thông tin lô hàng"
                          >
                            <span className="px-2 py-0.5 rounded-md bg-sky-50 border border-sky-200 group-hover:bg-sky-100">
                              {comm.creditNoteNumber || `CN-${comm.id}`}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-sky-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                          </button>
                        </td>

                        {/* 2. Tracking: dòng 1 số tracking, dòng 2 hãng, dòng 3 ngày */}
                        <td className="py-3.5 px-4 font-mono">
                          <div className="font-bold text-slate-800 text-xs">
                            {comm.trackingNumber || comm.bookingCode}
                          </div>
                          <div className="text-[11px] text-slate-600 font-sans mt-0.5">
                            {comm.carrier || 'DHL'}
                          </div>
                          <div className="text-[11px] text-slate-400 font-sans">
                            {comm.waybillDate || comm.date}
                          </div>
                        </td>

                        {/* 3. Khách hàng & Tuyến (bỏ hậu tố AU/US) */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-800 text-xs">
                            {comm.customerName.replace(/\s*->.*$/, '').replace(/\s*\([A-Z]{2}\)/g, '').trim()}
                          </div>
                          <div className="text-[11px] text-slate-500 font-semibold">{comm.route}</div>
                        </td>

                        {/* 4. Trọng lượng tính phí (bỏ ghi chú Đã đo thực tế) */}
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-xs text-slate-800">
                          {comm.cw} kg
                        </td>

                        {/* 5. Cột Giá Cost */}
                        <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-600 text-xs tabular-nums">
                          {costVal.toLocaleString('vi-VN')} ₫
                        </td>

                        {/* 6. Cước thu khách (Giá bán) */}
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 text-xs tabular-nums">
                          {comm.salePrice.toLocaleString('vi-VN')} ₫
                        </td>

                        {/* 7. Hoa hồng thực nhận (bỏ giải thích Đã trừ 10% TNCN) */}
                        <td className="py-3.5 px-4 text-right font-mono font-extrabold text-emerald-600 text-xs tabular-nums">
                          +{comm.commissionAmount.toLocaleString('vi-VN')} ₫
                        </td>

                        {/* 8. Trạng thái */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          {comm.status === 'paid' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Đã thanh toán
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              Chờ đối soát
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= NV CTV SUMMARY PAYOUT VIEW ================= */}
      {role === 'nv' && activeTab === 'ctv_payout' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Duyệt Chi Trả Hoa Hồng Cho Từng Cộng Tác Viên
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Xác nhận ủy nhiệm chi thanh toán vào ngày 15 hàng tháng
              </p>
            </div>
            <button
              onClick={exportExcel}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" /> Tải Báo Cáo Kế Toán
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Cộng Tác Viên</th>
                  <th className="py-3 px-4 text-right">Tổng Hoa Hồng (Tháng)</th>
                  <th className="py-3 px-4 text-right">Số tiền chưa thanh toán</th>
                  <th className="py-3 px-4">Thông tin chuyển khoản ngân hàng</th>
                  <th className="py-3 px-4 text-center">Hành động Phê duyệt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {collaborators.map((ctv) => (
                  <tr key={ctv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{ctv.name}</div>
                      <div className="text-xs text-slate-500">
                        {ctv.code} · Hạng {ctv.tier.toUpperCase()} ({ctv.commissionRate}%)
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {ctv.totalCommission.toLocaleString('vi-VN')} ₫
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                      {ctv.pendingCommission > 0 ? (
                        <span className="font-extrabold text-amber-600">
                          {ctv.pendingCommission.toLocaleString('vi-VN')} ₫
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">0 ₫</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      <div className="font-mono font-bold text-slate-800">
                        {ctv.bankAccount} - {ctv.bankName}
                      </div>
                      <div className="text-slate-500 font-semibold">{ctv.bankAccountName}</div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {ctv.pendingCommission > 0 ? (
                        <button
                          onClick={() => payAllCtvCommission(ctv.id)}
                          className="px-3 py-1.5 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors shadow-2xs"
                        >
                          Duyệt chi ({(ctv.pendingCommission / 1000000).toFixed(1)}M)
                        </button>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Đã thanh toán đủ
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Credit Note Detail Modal */}
      <CreditNoteDetailModal
        commission={selectedCommission}
        isOpen={!!selectedCommission}
        onClose={() => setSelectedCommission(null)}
      />
    </div>
  );
};
