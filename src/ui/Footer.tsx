import { payment } from "../assets"
import Container from "./Container"
import FooterTop from "./FooterTop"

const Footer = () => {
  return (
    <div className="mt-10">
      <FooterTop />
      <Container className="flex flex-col md:flex-row items-center justify-between md:gap-0 gap-4">
        <p>© 2025 Meow Electronics Solutions. Copyright by the DBMS Team.</p>
        <img src={payment} alt="payment-online" className="object-cover"/>
      </Container>
    </div>
  )
}
export default Footer