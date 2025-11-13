import Link from "next/link"
import Image from "next/image"
const Navbar = () => { 
    return (
        <header>
        <nav>
            <Link href='/' className="logo">
                <Image src="/icons/logo.png" alt="logo" width={24} height={24} />
                <p>DevEvent</p>
            </Link>
            

            <ul className="nav-links">
                <Link href="/">Home</Link>
                <Link href="/about">Event</Link>
                <Link href="/events">Create Events</Link>
            </ul>
        </nav>
        </header>
    )
}

export default Navbar