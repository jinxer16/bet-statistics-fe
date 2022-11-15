import styles from '../styles/Home.module.css'
import { ConnectButton } from "@web3uikit/web3";

export default function Header() {
    return (
        <nav>
            <h1></h1>
            <div>
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    );
}