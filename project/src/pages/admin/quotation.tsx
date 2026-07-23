import { useState, useEffect, useMemo } from 'react';
import { Search, Phone, Mail, Building, Eye, FileText, Download, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import axios from 'axios';

// Types for quotations - Updated to match API
type QuotationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Sent';

interface ApiQuotation {
    id: number;
    quotation_no: string;
    user_id: number;
    customer_name: string;
    customer_mobile: string;
    customer_email: string;
    total_items: number;
    total_amount: string;
    total_discount: string;
    grand_total: string;
    status: string;
    remarks: string;
    created_at: string;
    updated_at: string;
}

interface QuotationItem {
    id: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
}

interface Quotation {
    id: string;
    quotationNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    company: string;
    status: QuotationStatus;
    items: QuotationItem[];
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
    validUntil: string;
    notes?: string;
    totalDiscount?: string;
    grandTotal?: string;
}

const statusColors: Record<QuotationStatus, string> = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Approved: 'bg-green-100 text-green-700',
    Rejected: 'bg-red-100 text-red-700',
    Sent: 'bg-blue-100 text-blue-700',
};

const statusIcons: Record<QuotationStatus, React.ReactNode> = {
    Pending: <Clock className="w-4 h-4" />,
    Approved: <CheckCircle className="w-4 h-4" />,
    Rejected: <XCircle className="w-4 h-4" />,
    Sent: <FileText className="w-4 h-4" />,
};

export function AdminQuotations() {
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // Fetch quotations data
    useEffect(() => {
        fetchQuotations();
    }, []);

    // Transform API data to match component structure
    const transformApiData = (apiData: ApiQuotation[]): Quotation[] => {
        return apiData.map((item) => ({
            id: item.id.toString(),
            quotationNumber: item.quotation_no,
            customerName: item.customer_name,
            customerEmail: item.customer_email,
            customerPhone: item.customer_mobile,
            company: 'N/A', // Company not available in API
            status: mapStatus(item.status),
            items: [], // Items not available in the current API response
            totalAmount: parseFloat(item.grand_total) || parseFloat(item.total_amount) || 0,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
            notes: item.remarks || '',
            totalDiscount: item.total_discount,
            grandTotal: item.grand_total,
        }));
    };

    // Map API status to our status type
    const mapStatus = (apiStatus: string): QuotationStatus => {
        const statusMap: Record<string, QuotationStatus> = {
            'Pending': 'Pending',
            'Approved': 'Approved',
            'Rejected': 'Rejected',
            'Sent': 'Sent',
        };
        return statusMap[apiStatus] || 'Pending';
    };

    const fetchQuotations = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/quotations');

            if (response.data.success && response.data.data) {
                const transformedData = transformApiData(response.data.data);
                setQuotations(transformedData);
            } else {
                // Fallback to sample data if API fails
                setQuotations(getSampleQuotations());
            }
        } catch (error) {
            console.error('Error fetching quotations:', error);
            toast.error('Failed to load quotations. Using sample data.');
            // Fallback to sample data
            setQuotations(getSampleQuotations());
        } finally {
            setLoading(false);
        }
    };

    // Sample data for demonstration
    const getSampleQuotations = (): Quotation[] => {
        return [
            {
                id: '1',
                quotationNumber: 'QT-2024-001',
                customerName: 'Rajesh Kumar',
                customerEmail: 'rajesh@example.com',
                customerPhone: '+91 98765 43210',
                company: 'Tech Solutions Pvt Ltd',
                status: 'Pending',
                items: [
                    { id: '1', productName: 'Industrial Pump A-100', quantity: 2, price: 15000, total: 30000 },
                    { id: '2', productName: 'Control Valve V-200', quantity: 1, price: 25000, total: 25000 },
                ],
                totalAmount: 55000,
                createdAt: '2024-12-15T10:30:00Z',
                updatedAt: '2024-12-15T10:30:00Z',
                validUntil: '2025-01-15',
                notes: 'Customer needs delivery within 2 weeks',
            },
            {
                id: '2',
                quotationNumber: 'QT-2024-002',
                customerName: 'Priya Sharma',
                customerEmail: 'priya@example.com',
                customerPhone: '+91 87654 32109',
                company: 'Green Energy Systems',
                status: 'Sent',
                items: [
                    { id: '3', productName: 'Solar Panel SP-300', quantity: 10, price: 8000, total: 80000 },
                ],
                totalAmount: 80000,
                createdAt: '2024-12-14T14:20:00Z',
                updatedAt: '2024-12-14T16:45:00Z',
                validUntil: '2025-01-10',
            },
            {
                id: '3',
                quotationNumber: 'QT-2024-003',
                customerName: 'Amit Patel',
                customerEmail: 'amit@example.com',
                customerPhone: '+91 76543 21098',
                company: 'Industrial Machinery Co',
                status: 'Approved',
                items: [
                    { id: '4', productName: 'Conveyor Belt CB-500', quantity: 3, price: 12000, total: 36000 },
                    { id: '5', productName: 'Motor Drive MD-100', quantity: 2, price: 18000, total: 36000 },
                ],
                totalAmount: 72000,
                createdAt: '2024-12-12T09:15:00Z',
                updatedAt: '2024-12-13T11:30:00Z',
                validUntil: '2025-01-05',
            },
        ];
    };

    const filtered = useMemo(() => {
        let result = [...quotations];
        if (search) {
            const q = search.toLowerCase();
            result = result.filter((item) =>
                item.customerName.toLowerCase().includes(q) ||
                item.customerEmail.toLowerCase().includes(q) ||
                item.quotationNumber.toLowerCase().includes(q) ||
                item.company.toLowerCase().includes(q)
            );
        }
        if (statusFilter !== 'all') {
            result = result.filter((item) => item.status.toLowerCase() === statusFilter.toLowerCase());
        }
        return result;
    }, [quotations, search, statusFilter]);

    const updateStatus = async (quotation: Quotation, status: QuotationStatus) => {
        try {
            // Update local state
            setQuotations((prev) => prev.map((q) =>
                q.id === quotation.id ? { ...q, status } : q
            ));
            setSelectedQuotation({ ...quotation, status });
            toast.success(`Quotation marked as ${status}`);

            // Call API to update status
            await axios.patch(`http://localhost:5000/api/quotations/${quotation.id}/status`, { status });
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const handleViewQuotation = (quotation: Quotation) => {
        setSelectedQuotation(quotation);
        setIsDetailModalOpen(true);
    };

    const handleDownloadPDF = (quotation: Quotation) => {
        toast.success(`Downloading PDF for ${quotation.quotationNumber}`);
        // In a real app, generate and download PDF
    };

    // Helper function to safely get initials
    const getInitials = (name: string) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading quotations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Quotations</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage customer quotations and pricing
                        {quotations.length > 0 && ` (${quotations.length} quotations)`}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchQuotations}
                        disabled={loading}
                    >
                        Refresh
                    </Button>
                    <Button size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        New Quotation
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['Pending', 'Sent', 'Approved', 'Rejected'] as QuotationStatus[]).map((status) => {
                    const count = quotations.filter((q) => q.status === status).length;
                    return (
                        <Card key={status} className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold">{count}</div>
                                    <div className="text-xs text-muted-foreground capitalize">{status}</div>
                                </div>
                                <div className={cn('w-8 h-8 rounded-full flex items-center justify-center',
                                    status === 'Pending' && 'bg-yellow-100 text-yellow-700',
                                    status === 'Sent' && 'bg-blue-100 text-blue-700',
                                    status === 'Approved' && 'bg-green-100 text-green-700',
                                    status === 'Rejected' && 'bg-red-100 text-red-700'
                                )}>
                                    {statusIcons[status]}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Toolbar */}
            <div className="flex gap-2">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search quotations..."
                        className="pl-9 h-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px] h-9">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quotation</th>
                                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Customer</th>
                                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Amount</th>
                                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Date</th>
                                <th className="p-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                        No quotations found
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((quotation) => (
                                    <tr
                                        key={quotation.id}
                                        className="border-b hover:bg-muted/30 transition-colors"
                                    >
                                        <td className="p-3">
                                            <div>
                                                <div className="font-medium text-sm">{quotation.quotationNumber}</div>
                                                <div className="text-xs text-muted-foreground">{quotation.company}</div>
                                            </div>
                                        </td>
                                        <td className="p-3 hidden md:table-cell">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-8 h-8">
                                                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                                        {getInitials(quotation.customerName)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="text-sm font-medium">{quotation.customerName}</div>
                                                    <div className="text-xs text-muted-foreground">{quotation.customerEmail}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <Badge className={cn('text-xs flex items-center gap-1 w-fit', statusColors[quotation.status])}>
                                                {statusIcons[quotation.status]}
                                                {quotation.status}
                                            </Badge>
                                        </td>
                                        <td className="p-3 hidden lg:table-cell">
                                            <div className="text-sm font-medium">₹{quotation.totalAmount.toLocaleString()}</div>
                                            <div className="text-xs text-muted-foreground">{quotation.items?.length || 0} items</div>
                                        </td>
                                        <td className="p-3 hidden lg:table-cell text-sm text-muted-foreground">
                                            {new Date(quotation.createdAt).toLocaleDateString('en-IN')}
                                        </td>
                                        <td className="p-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => handleViewQuotation(quotation)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => handleDownloadPDF(quotation)}
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Quotation Detail Modal */}
            <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    {selectedQuotation && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center justify-between">
                                    <span>{selectedQuotation.quotationNumber}</span>
                                    <Badge className={cn('text-xs', statusColors[selectedQuotation.status])}>
                                        {selectedQuotation.status}
                                    </Badge>
                                </DialogTitle>
                                <DialogDescription>
                                    Quotation details and management
                                </DialogDescription>
                            </DialogHeader>

                            <div className="mt-6 space-y-5">
                                {/* Customer Info */}
                                <div className="flex items-start gap-3">
                                    <Avatar className="w-12 h-12">
                                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-lg">
                                            {getInitials(selectedQuotation.customerName)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{selectedQuotation.customerName}</h3>
                                        <div className="space-y-1 mt-1">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="w-4 h-4 text-muted-foreground" />
                                                {selectedQuotation.customerEmail}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="w-4 h-4 text-muted-foreground" />
                                                {selectedQuotation.customerPhone}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Building className="w-4 h-4 text-muted-foreground" />
                                                {selectedQuotation.company}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="p-4 rounded-lg bg-muted/30">
                                    <div className="text-xs text-muted-foreground mb-2 font-semibold">Items</div>
                                    <div className="space-y-2">
                                        {selectedQuotation.items && selectedQuotation.items.length > 0 ? (
                                            <>
                                                {selectedQuotation.items.map((item) => (
                                                    <div key={item.id} className="flex items-center justify-between text-sm py-1 border-b last:border-0">
                                                        <span>{item.productName}</span>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-muted-foreground">{item.quantity} × ₹{item.price.toLocaleString()}</span>
                                                            <span className="font-medium">₹{item.total.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="flex items-center justify-between pt-2 border-t font-semibold">
                                                    <span>Total</span>
                                                    <span>₹{selectedQuotation.totalAmount.toLocaleString()}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-sm text-muted-foreground">
                                                No items available. Grand Total: ₹{selectedQuotation.totalAmount.toLocaleString()}
                                                {selectedQuotation.totalDiscount && (
                                                    <div className="text-xs mt-1">Discount: ₹{parseFloat(selectedQuotation.totalDiscount).toLocaleString()}</div>
                                                )}
                                                {selectedQuotation.grandTotal && (
                                                    <div className="text-xs mt-1 font-medium">Grand Total: ₹{parseFloat(selectedQuotation.grandTotal).toLocaleString()}</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {selectedQuotation.notes && (
                                    <div className="p-4 rounded-lg bg-muted/30">
                                        <div className="text-xs text-muted-foreground mb-1">Notes</div>
                                        <div className="text-sm">{selectedQuotation.notes}</div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-2 border-t">
                                    <div>Created: {new Date(selectedQuotation.createdAt).toLocaleString('en-IN')}</div>
                                    <div>Valid Until: {new Date(selectedQuotation.validUntil).toLocaleDateString('en-IN')}</div>
                                </div>

                                {/* Status Update Actions */}
                                <DialogFooter className="flex-col sm:flex-row gap-2">
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        {(['Pending', 'Sent', 'Approved', 'Rejected'] as QuotationStatus[]).map((status) => (
                                            <Button
                                                key={status}
                                                variant={selectedQuotation.status === status ? 'default' : 'outline'}
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => updateStatus(selectedQuotation, status)}
                                            >
                                                {statusIcons[status]}
                                                <span className="ml-1 capitalize">{status}</span>
                                            </Button>
                                        ))}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDownloadPDF(selectedQuotation)}
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download PDF
                                    </Button>
                                </DialogFooter>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}