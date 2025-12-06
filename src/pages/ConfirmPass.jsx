

export default function ConfirmPass() {
  return (
    <div className="min-h-screen flex items-center justify-center  text-white relative overflow-hidden animate-fadeUp">
      {/* aura*/}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full blur-[200px] opacity-40"></div>

      <div className="relative z-10 bg-[#111111]/70 backdrop-blur-md p-10 rounded-3xl shadow-[0_0_30px_rgba(0,255,0,0.1)] w-[90%] max-w-md text-center border border-green-800/30">
        <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
        <p className="text-gray-400 text-sm mb-8">
      We are exclited to have your black log in now and access your account 
          <br />
        </p>

        {/* Password */}
        <div className="text-left mb-6">
          <div className="flex justify-between items-center">
            <input
              type="password"
              placeholder="New password"
              className="w-full px-4 py-2 rounded-md bg-transparent border-b border-gray-700 focus:border-[#1E7D04] outline-none text-gray-200 placeholder-gray-500 focus:placeholder-transparent"
            />
          </div>
        </div>
        {/*Confirm Password */}
        <div className="text-left mb-6">
          <div className="flex justify-between items-center">
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full px-4 py-2 rounded-md bg-transparent border-b border-gray-700 focus:border-[#1E7D04] outline-none text-gray-200 placeholder-gray-500 focus:placeholder-transparent"
            />
          </div>
        </div>
        {/*reset button */}
        <button
          className="w-full bg-gradient-to-r from-[#1E7D04] to-[#0A3301] py-3 rounded-full font-semibold text-white hover:opacity-80 transition-all duration-300 shadow-[0_0_20px_rgba(30,125,4,0.3)]"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
