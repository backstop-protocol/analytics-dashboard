import Flex, { FlexItem } from 'styled-flex-component'
import SidebarPoolItem from './components/SidebarPoolItem'
import MainGrid from './components/MainGrid'
import LiquidationsHistory from './components/LiquidationsHistory'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import mainStroe from './stores/main.store'
import '@picocss/pico/css/pico.min.css'
import './index.css'

function App() {
  return (
    <div className="App" >
        <Navbar/>
        <main className="container-fluid">
          <MainGrid/>
          <LiquidationsHistory/>
        </main>
        <Footer/>
    </div>
  );
}

export default App;
