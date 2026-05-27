export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="text-emerald-400 font-bold text-lg">
              MediStore
            </span>
            <p className="mt-2 text-sm text-gray-400">
              Your Trusted Online Medicine Shop in BD. Providing genuine
              over-the-counter medicines right at your doorstep.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href="/shop" className="hover:text-emerald-400">
                  Browse Medicines
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-emerald-400">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              Contact
            </h3>
            <p className="mt-4 text-sm text-gray-400">
              Email: support@medistore.com
            </p>
            <p className="text-sm text-gray-400">Hotline: +880 1234-5678900</p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>
            Copyright © {new Date().getFullYear()} - MediStore. All rights
            reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
