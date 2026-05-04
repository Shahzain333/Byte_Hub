import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { LockIcon, MailIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { AppContext } from "../../context/AppContext";
const AdminLogin = () => {
  const { navigate, loading, setLoading, axios, setAdmin } =
    useContext(AppContext);
  // state for input value
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // handle change input value
  const onChangeHandler = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/auth/admin/login", formData);

      if (data.success) {
        localStorage.setItem("admin", JSON.stringify(data.admin));
        setAdmin(true);
        toast.success(data.message);
        navigate("/admin");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-[calc(100vh-72px)] bg-cyan-50 py-4 px-2 md:px-0 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-[380px] text-center border border-amber-200 rounded-2xl 
        px-4 md:px-8 bg-white shadow-md"
      >
        {/* Header accent bar */}
        <div className="w-16 h-1 bg-[#FFB703] rounded-full mx-auto mt-10 mb-4" />

        <h1 className="text-[#1A1A1A] text-3xl font-bold">
          Welcome Back
        </h1>
        <p className="text-zinc-500 text-sm mt-2 pb-6">
          Please login to continue
        </p>

        {/* Email Field */}
        <div className="flex items-center w-full mt-4 bg-amber-50 border border-amber-200
        h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-[#FFB703] transition-colors">
          <MailIcon size={18} className="text-[#E09A05] shrink-0" />
          <input
            type="email"
            placeholder="Email address"
            className="bg-transparent text-[#1A1A1A] placeholder-zinc-400 
            outline-none text-sm w-[80%] h-full"
            name="email"
            value={formData.email}
            onChange={onChangeHandler}
            required
          />
        </div>

        {/* Password Field */}
        <div className="flex items-center mt-4 w-full bg-amber-50 border border-amber-200 
        h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-[#FFB703] transition-colors">
          <LockIcon size={18} className="text-[#E09A05] shrink-0" />
          <input
            type="password"
            placeholder="Password"
            className="bg-transparent text-[#1A1A1A] placeholder-zinc-400 
            outline-none text-sm w-[80%] h-full"
            name="password"
            value={formData.password}
            onChange={onChangeHandler}
            required
          />
        </div>

        <button
          type="submit"
          className="mt-5 w-full h-11 rounded-full bg-[#FFB703] hover:bg-[#E09A05] text-white 
            cursor-pointer transition-colors font-medium shadow-sm"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <p className="text-zinc-500 text-sm mt-3 mb-10">
          Don't have an account?{' '}
          <Link to={"/signup"} className="text-[#FFB703] hover:text-[#E09A05] font-medium transition-colors">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default AdminLogin;
