export default function Home() {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-emerald-600 to-teal-700 text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Your Trusted Online Medicine Shop Here
          </h1>
          <p className="mt-6 text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto">
            Order over-the-counter (OTC) medicines safely and get them delivered
            directly to your doorstep with Cash on Delivery.
          </p>
          <div className="mt-10">
            <a
              href="/shop"
              className="bg-white text-emerald-700 font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-emerald-50 transition duration-300"
            >
              Browse Medicines
            </a>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Popular Categories</h2>
        <p className="text-gray-500 mt-2">
          Find your medicines by categories Here
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
          {["OTC Medicines", "Vitamins", "Baby Care", "First Aid"].map(
            (cat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition text-center cursor-pointer"
              >
                <span className="text-3xl block mb-2">💊</span>
                <h3 className="font-semibold text-gray-800">{cat}</h3>
              </div>
            ),
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Featured Medicines
          </h2>
          <p className="text-gray-500 mt-2">
            Top selling products available right now
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10">
          {[
            { name: "Napa Extend", price: "৳ 2.50", company: "Beximco" },
            { name: "Ace Plus", price: "৳ 3.00", company: "Square" },
            { name: "Seclo 20mg", price: "৳ 7.00", company: "Square" },
          ].map((med, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                  In Stock
                </span>
                <h3 className="font-bold text-lg text-gray-800 mt-2">
                  {med.name}
                </h3>
                <p className="text-xs text-gray-400">
                  {med.company} Pharmaceuticals
                </p>
              </div>
              <div className="flex justify-between items-center mt-6">
                <span className="font-bold text-gray-900 text-lg">
                  {med.price}
                </span>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-md transition">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-emerald-50 py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-4">
            <span className="text-4xl">🚚</span>
            <h3 className="font-bold text-xl text-gray-800 mt-4">
              Fastest Delivery
            </h3>
            <p className="text-gray-600 text-sm mt-2">
              Get your emergency medicine delivered within hours at your home.
            </p>
          </div>
          <div className="p-4">
            <span className="text-4xl">🛡️</span>
            <h3 className="font-bold text-xl text-gray-800 mt-4">
              100% Genuine
            </h3>
            <p className="text-gray-600 text-sm mt-2">
              All medicines are directly sourced from licensed pharmaceuticals
              companies.
            </p>
          </div>
          <div className="p-4">
            <span className="text-4xl">💵</span>
            <h3 className="font-bold text-xl text-gray-800 mt-4">
              Cash on Delivery
            </h3>
            <p className="text-gray-600 text-sm mt-2">
              No advance online payment required. Pay only after receiving your
              goods.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
