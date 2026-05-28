import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import LibraryPage from "./pages/LibraryPage";
import ReaderPage from "./pages/ReaderPage";
import { useAppDispatch } from "./store/hooks";
import { hydrateBooks } from "./store/booksSlice";
import { loadLibrary } from "./utils/bookStorage";
import "./App.css";

function App() {
  const dispatch = useAppDispatch();
  const [isLibraryReady, setIsLibraryReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadLibrary()
      .then((library) => {
        if (!cancelled) {
          dispatch(hydrateBooks(library));
          setIsLibraryReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsLibraryReady(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  if (!isLibraryReady) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <p className="text-gray-500">Loading library…</p>
      </main>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LibraryPage />} />
      <Route path="/read/:bookId" element={<ReaderPage />} />
    </Routes>
  );
}

export default App;
