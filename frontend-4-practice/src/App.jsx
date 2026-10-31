import Header from './components/layout/Header';
import ProgressBar from './components/layout/ProgressBar';
import BookingScreen from './screens/BookingScreen';
import Footer from './components/layout/Footer';
import './App.css';

function App() {
  return (
    <>
      <Header />
      <ProgressBar />
      <BookingScreen />
      <Footer />
    </>
  );
}

export default App;