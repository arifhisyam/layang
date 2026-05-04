import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import { IconUser, IconMail, IconCircleCheck, IconAlertTriangle } from '@tabler/icons-react';

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Profile Settings — Layang-Layang 2026" />

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
                @keyframes ll-input-focus {
                    from { box-shadow: 0 0 0 0 rgba(14,165,233,0); }
                    to   { box-shadow: 0 0 0 3px rgba(14,165,233,0.18); }
                }

                .ll-settings-card {
                    position: relative;
                    background: rgba(255,255,255,0.68);
                    backdrop-filter: blur(24px) saturate(160%);
                    -webkit-backdrop-filter: blur(24px) saturate(160%);
                    border-radius: 22px;
                    border: 1.5px solid rgba(255,255,255,0.88);
                    box-shadow:
                        0 16px 48px rgba(11,31,58,0.10),
                        0 0 0 1px rgba(14,165,233,0.07),
                        inset 0 1px 0 rgba(255,255,255,0.95);
                    overflow: hidden;
                    padding: 32px 36px;
                    margin-bottom: 20px;
                }

                .ll-settings-card::before {
                    content: '';
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

                .ll-field-label {
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 700;
                    font-size: 11px;
                    letter-spacing: .09em;
                    text-transform: uppercase;
                    color: #1A3A5C;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin-bottom: 6px;
                }

                .ll-input-wrap {
                    position: relative;
                    display: flex;
                    align-items: center;
                    background: rgba(255,255,255,0.82);
                    border: 1.5px solid rgba(200,220,240,0.7);
                    border-radius: 14px;
                    overflow: hidden;
                    transition: border-color .22s ease, box-shadow .22s ease;
                }

                .ll-input-wrap:focus-within {
                    border-color: rgba(14,165,233,0.55);
                    box-shadow: 0 0 0 3px rgba(14,165,233,0.14);
                }

                .ll-input-wrap .ll-icon {
                    padding-left: 14px;
                    color: #7A9ABE;
                    display: flex;
                    align-items: center;
                    flex-shrink: 0;
                }

                .ll-input-wrap input {
                    border: none !important;
                    background: transparent !important;
                    padding: 13px 16px !important;
                    font-size: 14px !important;
                    color: #0B1F3A !important;
                    font-family: 'Open Sans', sans-serif !important;
                    outline: none !important;
                    width: 100%;
                    box-shadow: none !important;
                }

                .ll-save-btn {
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 800;
                    font-size: 13.5px;
                    letter-spacing: .06em;
                    background: linear-gradient(135deg, #1565C0, #0A2F5E);
                    color: #fff;
                    border: none;
                    border-radius: 12px;
                    padding: 11px 26px;
                    cursor: pointer;
                    box-shadow: 0 6px 20px rgba(21,101,192,0.32);
                    transition: all .28s cubic-bezier(.34,1.4,.64,1);
                }

                .ll-save-btn:hover:not(:disabled) {
                    background: linear-gradient(135deg, #0EA5E9, #1256B8);
                    box-shadow: 0 10px 28px rgba(14,165,233,0.42);
                    transform: translateY(-2px);
                }

                .ll-save-btn:disabled {
                    background: linear-gradient(135deg, #93C5FD, #60A5FA);
                    cursor: not-allowed;
                    transform: none;
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
                    pointer-events: none;
                    animation: spin-slow linear infinite;
                }

                .ll-verify-banner {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    background: rgba(251,191,36,0.1);
                    border: 1px solid rgba(251,191,36,0.35);
                    border-radius: 12px;
                    padding: 12px 16px;
                    font-family: 'Open Sans', sans-serif;
                    font-size: 13px;
                    color: #7A4A00;
                }

                .ll-success-banner {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(14,165,233,0.09);
                    border: 1px solid rgba(14,165,233,0.28);
                    border-radius: 10px;
                    padding: 8px 14px;
                    font-family: 'Open Sans', sans-serif;
                    font-size: 13px;
                    color: #0A4A8C;
                    font-weight: 600;
                }
            `}</style>

            <h1 className="sr-only">Profile settings</h1>

            {/* Badge */}
            <div className="ll-kite-badge">
                <span style={{ animation: 'float-kite 3s ease-in-out infinite', display: 'inline-block' }}>🪁</span>
                Layang-Layang · Kompetisi 2026
            </div>

            {/* Profile Info Card */}
            <div className="ll-settings-card">
                {/* Decorative rings */}
                <div className="ll-deco-ring" style={{ width: 100, height: 100, top: -42, right: -42, border: '1px dashed rgba(14,165,233,0.14)', animationDuration: '24s' }} />
                <div className="ll-deco-ring" style={{ width: 62, height: 62, top: -22, right: -22, border: '1px solid rgba(14,165,233,0.22)', animationDuration: '14s', animationDirection: 'reverse' }} />

                <div className="ll-section-title">Informasi Profil</div>
                <div className="ll-section-desc">Perbarui nama dan alamat email akunmu</div>

                <Form
                    {...ProfileController.update.form()}
                    options={{ preserveScroll: true }}
                >
                    {({ processing, recentlySuccessful, errors }) => (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {/* Name */}
                            <div>
                                <div className="ll-field-label">
                                    <IconUser size={13} color="#0EA5E9" />
                                    Nama Lengkap
                                </div>
                                <div className="ll-input-wrap">
                                    <span className="ll-icon"><IconUser size={17} /></span>
                                    <Input
                                        id="name"
                                        defaultValue={auth.user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Nama lengkap"
                                    />
                                </div>
                                <InputError message={errors.name} style={{ marginTop: 6, fontSize: 12 }} />
                            </div>

                            {/* Email */}
                            <div>
                                <div className="ll-field-label">
                                    <IconMail size={13} color="#0EA5E9" />
                                    Alamat Email
                                </div>
                                <div className="ll-input-wrap">
                                    <span className="ll-icon"><IconMail size={17} /></span>
                                    <Input
                                        id="email"
                                        type="email"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="Alamat email"
                                    />
                                </div>
                                <InputError message={errors.email} style={{ marginTop: 6, fontSize: 12 }} />
                            </div>

                            {/* Unverified email banner */}
                            {mustVerifyEmail && auth.user.email_verified_at === null && (
                                <div>
                                    <div className="ll-verify-banner">
                                        <IconAlertTriangle size={16} color="#D97706" style={{ flexShrink: 0, marginTop: 1 }} />
                                        <span>
                                            Email belum diverifikasi.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                style={{
                                                    color: '#1565C0', fontWeight: 700,
                                                    fontFamily: "'Montserrat', sans-serif",
                                                    textDecoration: 'underline', textUnderlineOffset: 3,
                                                    background: 'none', border: 'none', cursor: 'pointer',
                                                    fontSize: 13,
                                                }}
                                            >
                                                Klik untuk kirim ulang email verifikasi.
                                            </Link>
                                        </span>
                                    </div>

                                    {status === 'verification-link-sent' && (
                                        <div className="ll-success-banner" style={{ marginTop: 10 }}>
                                            <IconCircleCheck size={15} color="#0EA5E9" />
                                            Tautan verifikasi baru telah dikirim ke emailmu.
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Save */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 4 }}>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="ll-save-btn"
                                    data-test="update-profile-button"
                                >
                                    Simpan Perubahan
                                </button>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out duration-300"
                                    enterFrom="opacity-0 translate-x-2"
                                    leave="transition ease-in-out duration-300"
                                    leaveTo="opacity-0"
                                >
                                    <div className="ll-success-banner">
                                        <IconCircleCheck size={15} color="#0EA5E9" />
                                        Tersimpan!
                                    </div>
                                </Transition>
                            </div>
                        </div>
                    )}
                </Form>
            </div>

            <DeleteUser />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit(),
        },
    ],
};