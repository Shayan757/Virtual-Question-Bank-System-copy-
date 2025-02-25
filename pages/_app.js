import "../styles/global.css";
import AdminState from "../Context/AdminState"

export default function App({ Component, pageProps }) {
  return (

<AdminState>

<Component {...pageProps} />

</AdminState>


  ) 
  
  
  
  
  
}
