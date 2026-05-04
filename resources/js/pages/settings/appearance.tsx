import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
    return (
        <>
            <Head title="Appearance Settings — Layang-Layang 2026" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Open+Sans:wght@400;600&display=swap');

                @keyframes shimmer-text {
                    0%   { background-position: 0% 50%; }
                    50%  { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                @keyframes float-kite {
                    0%, 100% { transform: translateY(0)   rotate(-5deg); }
                    50%      { transform: translateY(-8px) rotate(5deg); }
                }

                .ll-settings-card {
                    position: relative;
                    background: rgba(255, 255, 255, 0.68);
                    backdrop-filter: blur(24px) saturate(160%);
                    -webkit-backdrop-filter: blur(24px) saturate(160%);
                    border-radius: 22px;
                    border: 1.5px solid rgba(255, 255, 255, 0.88);
                    box-shadow:
                        0 16px 48px rgba(11, 31, 58, 0.10),
                        0 0 0 1px rgba(14, 165, 233, 0.07),
                        inset 0 1px 0 rgba(255, 255, 255, 0.95);
                    overflow: hidden;
                    padding: 32px 36px;
                }

                .ll-settings-card::before {
                    content: '';
                    display: block;
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, #0EA5E9 0%, #1565C0 50%, #0A2F5E 100%);
                }

                .ll-section-title {
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 800;
                    font-size: 17px;
                    letter-spacing: -0.01em;
                    background: linear-gradient(135deg, #0A2F5E, #1565C0, #0EA5E9);
                    background-size: 200%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: shimmer-text 6s ease infinite;
                    margin-bottom: 4px;
                }

                .ll-section-desc {
                    font-family: 'Open Sans', sans-serif;
                    font-size: 13px;
                    color: #4A6A8A;
                    margin-bottom: 24px;
                }

                .ll-kite-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-family: 'Montserrat', sans-serif;
                    font-size: 9.5px;
                    font-weight: 700;
                    letter-spacing: .14em;
                    text-transform: uppercase;
                    color: #5A8AC0;
                    background: rgba(14,165,233,0.08);
                    border: 1px solid rgba(14,165,233,0.18);
                    border-radius: 999px;
                    padding: 4px 10px;
                    margin-bottom: 20px;
                }

                .ll-deco-ring {
                    position: absolute;
                    border-radius: 50%;
                    animation: spin-slow linear infinite;
                    pointer-events: none;
                }
            `}</style>

            <h1 className="sr-only">Appearance settings</h1>

            {/* Badge */}
            <div className="ll-kite-badge">
                <span style={{ animation: 'float-kite 3s ease-in-out infinite', display: 'inline-block' }}>🪁</span>
                Layang-Layang · Kompetisi 2026
            </div>

            <div className="ll-settings-card">
                {/* Decorative rings */}
                <div className="ll-deco-ring" style={{
                    width: 100, height: 100, top: -40, right: -40,
                    border: '1px dashed rgba(14,165,233,0.15)',
                    animationDuration: '22s',
                }} />
                <div className="ll-deco-ring" style={{
                    width: 64, height: 64, top: -20, right: -20,
                    border: '1px solid rgba(14,165,233,0.22)',
                    animationDuration: '14s',
                    animationDirection: 'reverse',
                }} />

                <div className="ll-section-title">Pengaturan Tampilan</div>
                <div className="ll-section-desc">Sesuaikan tampilan akunmu sesuai preferensi</div>

                <AppearanceTabs />
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'Appearance settings',
            href: editAppearance(),
        },
    ],
};