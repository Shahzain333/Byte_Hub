import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { ShoppingCart, BookOpen, MessageSquare, Grid3X3, UtensilsCrossed, TrendingUp, Clock, CheckCircle2,
  XCircle, AlertCircle, DollarSign, Users, ArrowUpRight
} from 'lucide-react'
import LoadingState from '../../components/LoadingState'

/* ─── counter ─── */

const Counter = ({ target, duration = 1200 }) => {
  
  const [count, setCount] = useState(0)

  useEffect(() => {
    // How much to add per millisecond
    const increment = target / duration

    let current = 0

    const timer = setInterval(() => {
  
      current += increment * 16   // ~16ms per frame (60fps)

      if (current >= target) {
        setCount(target)           // snap to exact final value
        clearInterval(timer)       // stop the loop
      } else {
        setCount(Math.floor(current))
      }
    }, 16)                        // run every ~16ms

    return () => clearInterval(timer)  // cleanup on unmount
  
  }, [target])

  return <>{count}</>

}

/* ─── stat card ─── */
const StatCard = ({ icon: Icon, label, value, sub, accent, delay = 0 }) => (

  <div className="relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100
    hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
    style={{ animationDelay: `${delay}ms` }}>

    {/* decorative blob */}
    <div className="absolute -right-4 -top-4 w-18 h-18 md:w-20 md:h-20 rounded-full opacity-10"
      style={{ background: accent }}/>

    <div className="flex items-start justify-between mb-3">
      
      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center" 
      style={{ background: `${accent}18` }}>
        <Icon size={20} style={{ color: accent }} />
      </div>

      <ArrowUpRight size={14} className="text-gray-300 mt-1" />
    
    </div>
    
    <p className="text-2xl font-bold text-gray-800 leading-none mb-1">
    
      <Counter target={typeof value === 'number' ? value : 0} />

      {typeof value === 'string' && value}
    
    </p>
    
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
  
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  
  </div>

)

/* ─── status pill ─── */
const Pill = ({ label, count, color }) => (
  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border"
    style={{ background: `${color}12`, color, borderColor: `${color}30` }}>

    <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
    {count} {label}

  </span>
)

/* ─── section header ─── */
const SectionHeader = ({ title, count }) => (
  
  <div className="flex items-center justify-between mb-4">
    
    <h3 className="text-base font-bold text-gray-700">{title}</h3>
    
    {count !== undefined && (
      <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 font-semibold
      px-2.5 py-1 rounded-full">{count} total</span>
    )}
  
  </div>
)

/* ─── recent order row ─── */
const OrderRow = ({ item, index }) => {
  
  const statusColor = {
    Pending: '#F59E0B', Preparing: '#3B82F6', Delivered: '#10B981'
  }
  
  const color = statusColor[item.status] || '#6B7280'
  
  return (
  
    <div className={`flex items-center gap-3 py-2.5 ${index !== 0 ? 'border-t border-gray-50' : ''}`}>
    
      <span className="text-xs font-mono text-gray-300 w-6">
        {String(index + 1).padStart(2, '0')}
      </span>
    
      <div className="flex-1 min-w-0">
    
        <p className="text-sm font-semibold text-gray-800 truncate">
          {item?.user?.username || 'Guest'}
        </p>
    
        <p className="text-xs text-gray-400 truncate">{item?.address}</p>
    
      </div>
    
      <div className="text-right flex-shrink-0">
    
        <p className="text-sm font-bold text-green-600">${item?.totalAmount}</p>
        <span className="text-xs font-medium" style={{ color }}>{item.status}</span>
    
      </div>
    
    </div>
  
  )

}

/* ─── booking row ─── */
const BookingRow = ({ item, index }) => {

  const statusColor = {
    Pending: '#F59E0B', Approved: '#10B981', Cancelled: '#EF4444'
  }
  
  const color = statusColor[item.status] || '#6B7280'
  
  const date = new Date(item.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })
  
  return (
  
    <div className={`flex items-center gap-3 py-2.5 ${index !== 0 ? 'border-t border-gray-50' : ''}`}>
    
      <span className="text-xs font-mono text-gray-300 w-6">
        {String(index + 1).padStart(2, '0')}
      </span>
    
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">{item?.name}</p>
        <p className="text-xs text-gray-400">{date} · {item?.time}</p>
      </div>
    
      <div className="text-right flex-shrink-0">
        <p className="text-xs text-gray-500">{item?.numberOfPeople} guests</p>
        <span className="text-xs font-medium" style={{ color }}>{item.status}</span>
      </div>
    
    </div>

  )

}

/* ══════════════════════════════════════════
  DASHBOARD
══════════════════════════════════════════ */
const Dashboard = () => {

  const { admin, axios, categories, menus, loading, setLoading } = useContext(AppContext)

  const [orders, setOrders] = useState([])
  const [bookings, setBookings] = useState([])
  const [contacts, setContacts] = useState([])

  useEffect(() => {

    if (!admin) return
    
    const load = async () => {
    
      try {
        setLoading(true)
        
        const [o, b, c] = await Promise.all([
          axios.get('/api/order/orders'),
          axios.get('/api/booking/bookings'),
          axios.get('/api/contact/all'),
        ])
    
        if (o.data.success) setOrders(o.data.orders)
        if (b.data.success) setBookings(b.data.bookings)
        if (c.data.success) setContacts(c.data.contacts)
    
      } catch (e) {
        console.log('Dashboard fetch error', e)
      } finally {
        setLoading(false)
      }
    }

    load()
  
  }, [admin])

  /* derived stats */
  const totalRevenue = orders.reduce((s, o) => s + Number(o.totalAmount || 0), 0)
  const pendingOrders = orders.filter(o => o.status === 'Pending').length
  const preparingOrders = orders.filter(o => o.status === 'Preparing').length
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length

  const pendingBookings = bookings.filter(b => b.status === 'Pending').length
  const approvedBookings = bookings.filter(b => b.status === 'Approved').length
  const cancelledBookings = bookings.filter(b => b.status === 'Cancelled').length

  const recentOrders = [...orders].slice(0, 5)
  const recentBookings = [...bookings].slice(0, 5)

  if (loading) {
    return (
      <LoadingState label={"Loading Dashboard...."} />
    )
  }

  return (
    <div className="space-y-7 pb-8">

      {/* ── Welcome Banner ── */}
      <div className="relative bg-gradient-to-br from-[#E09A05] via-[#FFB703] to-[#F5C842]
      rounded-2xl px-6 py-5 text-white overflow-hidden shadow-lg">
        
        {/* decorative rings */}
        <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/10" />
        <div className="absolute -right-2 top-6 w-20 h-20 rounded-full bg-white/10" />
        <div className="absolute right-20 -bottom-6 w-28 h-28 rounded-full bg-white/10" />

        <div className="relative z-10">

          <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">
            Admin Panel
          </p>

          <h1 className="text-2xl md:text-3xl font-extrabold">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'} 👋
          </h1>
          
          <p className="text-white/80 text-sm mt-1">
            Here's what's happening in your restaurant today.
          </p>
      
        </div>
      
      </div>

      {/* ── Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign}    label="Total Revenue"   value={totalRevenue}     sub={`${orders.length} orders`}    accent="#10B981" delay={0}   />
        <StatCard icon={ShoppingCart}  label="Total Orders"    value={orders.length}    sub={`${pendingOrders} pending`}   accent="#3B82F6" delay={50}  />
        <StatCard icon={BookOpen}      label="Total Bookings"  value={bookings.length}  sub={`${pendingBookings} pending`} accent="#E09A05" delay={100} />
        <StatCard icon={MessageSquare} label="Total Contacts"  value={contacts.length}  sub="Messages received"           accent="#8B5CF6" delay={150} />
        <StatCard icon={UtensilsCrossed} label="Menu Items"     value={menus.length}      sub="On the menu"           accent="#F97316" delay={0}  />
        <StatCard icon={Grid3X3}         label="Categories"     value={categories.length} sub="Food categories"       accent="#EC4899" delay={50} />
        <StatCard icon={Users}           label="Guest Covers"   value={bookings.reduce((s,b)=>s+Number(b.numberOfPeople||0),0)} sub="Across all bookings" accent="#06B6D4" delay={100} />
        <StatCard icon={TrendingUp}      label="Avg Order Value" value={orders.length ? Math.round(totalRevenue / orders.length) : 0} sub="Per order" accent="#84CC16" delay={150} />
      </div>

      {/* ── Order + Booking status breakdown ── */}
      <div className="grid md:grid-cols-2 gap-4">

        {/* Orders breakdown */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">

          <SectionHeader title="Order Status" count={orders.length} />
          
          <div className="flex flex-wrap gap-2">
            <Pill label="Pending"   count={pendingOrders}   color="#F59E0B" />
            <Pill label="Preparing" count={preparingOrders} color="#3B82F6" />
            <Pill label="Delivered" count={deliveredOrders} color="#10B981" />
          </div>

          {/* mini bar */}
          {orders.length > 0 && (
          
            <div className="mt-4 h-1.5 rounded-full bg-gray-100 overflow-hidden flex">

              <div style={{ width: `${(pendingOrders/orders.length)*100}%`, background: '#F59E0B' }} className="transition-all duration-700"/>
              <div style={{ width: `${(preparingOrders/orders.length)*100}%`, background: '#3B82F6' }} className="transition-all duration-700"/>
              <div style={{ width: `${(deliveredOrders/orders.length)*100}%`, background: '#10B981' }} className="transition-all duration-700"/>
          
            </div>
          
          )}

        </div>

        {/* Bookings breakdown */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">

          <SectionHeader title="Booking Status" count={bookings.length} />
          
          <div className="flex flex-wrap gap-2">
            <Pill label="Pending"   count={pendingBookings}   color="#F59E0B" />
            <Pill label="Approved"  count={approvedBookings}  color="#10B981" />
            <Pill label="Cancelled" count={cancelledBookings} color="#EF4444" />
          </div>

          {bookings.length > 0 && (

            <div className="mt-4 h-2 rounded-full bg-gray-100 overflow-hidden flex">
            
              <div style={{ width: `${(pendingBookings/bookings.length)*100}%`, background: '#F59E0B' }} className="transition-all duration-700"/>
              <div style={{ width: `${(approvedBookings/bookings.length)*100}%`, background: '#10B981' }} className="transition-all duration-700"/>
              <div style={{ width: `${(cancelledBookings/bookings.length)*100}%`, background: '#EF4444' }} className="transition-all duration-700"/>
            
            </div>
          
          )}

        </div>

      </div>

      {/* ── Recent Activity Tables ── */}
      <div className="grid lg:grid-cols-2 gap-5">

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">

          <SectionHeader title="Recent Orders" />
          
          {recentOrders.length > 0
            ? recentOrders.map((o, i) => <OrderRow key={o._id} item={o} index={i} />)
            : <p className="text-sm text-gray-400 text-center py-8">No orders yet</p>
          }
        
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">

          <SectionHeader title="Recent Bookings" />
          
          {recentBookings.length > 0
            ? recentBookings.map((b, i) => <BookingRow key={b._id} item={b} index={i} />)
            : <p className="text-sm text-gray-400 text-center py-8">No bookings yet</p>
          }
        
        </div>

      </div>

      {/* ── Recent Contacts ── */}
      {contacts.length > 0 && (

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        
          <SectionHeader title="Recent Messages" count={contacts.length} />
        
          <div className="space-y-0">
        
            {contacts.slice(0, 4).map((c, i) => (
        
              <div key={c._id} className={`flex items-start gap-3 py-3 ${i !== 0 ? 'border-t border-gray-50' : ''}`}>
              
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center
                flex-shrink-0 text-amber-600 font-bold text-sm">
                  {(c.name || 'U')[0].toUpperCase()}
                </div>
              
                <div className="flex-1 min-w-0">
              
                  <div className="flex items-baseline gap-2">
              
                    <p className="text-sm font-semibold text-gray-800">{c.name}</p>
                    
                    {c.subject && (
                      <span className="text-xs text-gray-400 truncate hidden sm:block">· {c.subject}</span>
                    )}
              
                  </div>
              
                  <p className="text-xs text-gray-400 truncate">{c.message}</p>
              
                </div>
              
                <span className="text-xs text-blue-500 truncate max-w-[250px] hidden md:block">{c.email}</span>
              
              </div>
            
            ))}

          </div>

        </div>
      )}

    </div>
  )
}

export default Dashboard