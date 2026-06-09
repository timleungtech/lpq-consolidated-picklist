import { FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import "./Header.css";

function Header() {
  return (
    <header className="no-print">
      <h1 style={{ textAlign: 'center' }}>LPQ Packing List</h1>
      <div className="header-icons">
        <a
          href="https://github.com/timleungtech/lpq-consolidated-picklist"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub />
        </a>
        <a href="mailto:timleungtech@gmail.com">
          <MdEmail />
        </a>
      </div>
    </header>
  )
}

export default Header