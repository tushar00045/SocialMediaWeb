import { Link, useParams } from "react-router-dom";

function Media() {
    return (
            <div className="min-h-[50vh] flex items-center justify-center px-4 py-10">
              <div className="surface w-full max-w-md rounded-3xl border border-white/10 p-8 text-center sm:p-10">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-volt/20 bg-volt/10">
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-volt"
                      >
                          <rect x="3" y="3" width="18" height="18" rx="3" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="m21 15-5-5L5 21" />
                      </svg>
                  </div>

                  <h2 className="text-2xl font-bold text-white">
                      No media yet
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                      Photos and videos shared by this user will appear here.
                      Check back when they've posted something new.
                  </p>

                  <Link
                      to="/"
                      className="mt-7 inline-flex rounded-xl bg-volt px-6 py-3 text-sm font-semibold text-black transition hover:brightness-110"
                  >
                      Go To HomePage
                  </Link>
              </div>
            </div>
    );
}

export default Media;