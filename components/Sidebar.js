import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiHome, FiFile, FiImage, FiTool, FiSettings } from 'react-icons/fi';

export default function Sidebar() {
    const router = useRouter();
    const navItems = [
        { name: 'Home', path: '/', icon: <FiHome /> },
        { name: 'PDF Tools', path: '/tools/pdf', icon: <FiFile /> },
        { name: 'Image Tools', path: '/tools/image', icon: <FiImage /> },
        { name: 'Utilities', path: '/tools/utilities', icon: <FiTool /> },
        { name: 'Settings', path: '/settings', icon: <FiSettings /> }
    ];

    return (
        <aside className="sidebar">
            <nav>
                <ul>
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <Link href={item.path}>
                                <div className={`nav-item ${router.pathname === item.path ? 'active' : ''}`}>
                                    <span className="icon">{item.icon}</span>
                                    <span>{item.name}</span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <style jsx>{`
                .sidebar {
                    width: 250px;
                    background: #f8fafc;
                    border-right: 1px solid #e2e8f0;
                    padding: 1rem;
                }
                .nav-item {
                    display: flex;
                    align-items: center;
                    padding: 0.75rem 1rem;
                    margin: 0.25rem 0;
                    border-radius: 0.375rem;
                    color: #64748b;
                    cursor: pointer;
                }
                .nav-item:hover {
                    background: #e2e8f0;
                    color: #334155;
                }
                .nav-item.active {
                    background: #e0e7ff;
                    color: #3b82f6;
                    font-weight: 500;
                }
                .icon {
                    margin-right: 0.75rem;
                    font-size: 1.25rem;
                }
            `}</style>
        </aside>
    );
}
