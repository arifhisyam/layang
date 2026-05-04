import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { edit } from '@/routes/security';
import { disable, enable } from '@/routes/two-factor';
import { IconKey, IconShield, IconLock, IconCircleCheck, IconShieldOff } from '@tabler/icons-react';

type Props = {
    canManageTwoFactor?: boolean;
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

export default function Security({
    canManageTwoFactor = false,
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        clearTwoFactorAuthData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
    const prevTwoFactorEnabled = useRef(twoFactorEnabled);

    useEffect(() => {
        if (prevTwoFactorEnabled.current && !twoFactorEnabled) {
            clearTwoFactorAuthData();
        }
        prevTwoFactorEnabled.current = twoFactorEnabled;
    }, [twoFactorEnabled, clearTwoFactorAuthData]);

    return (
        <>
            <Head title="Security Settings — Layang-Layang 2026" />

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
                @keyframes pulse-2fa {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(14,165,233,0.3); }
                    50%      { box-shadow: 0 0 0 8px rgba(14,165,233,0); }
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

                .ll-settings-card.ll-danger::before {
                    background: linear-gradient(90deg, #F87171 0%, #DC2626 50%, #7F1D1D 100%);
                }

                .ll-settings-card.ll-success::before {
                    background: linear-gradient(90deg, #34D399 0%, #059669 50%, #064E3B 100%);
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
                    display: flex;
                    align-items: center;
                    gap: 8px;
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
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
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

                .ll-enable-btn {
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 800;
                    font-size: 13.5px;
                    letter-spacing: .06em;
                    background: linear-gradient(135deg, #059669, #064E3B);
                    color: #fff;
                    border: none;
                    border-radius: 12px;
                    padding: 11px 26px;
                    cursor: pointer;
                    box-shadow: 0 6px 20px rgba(5,150,105,0.32);
                    transition: all .28s cubic-bezier(.34,1.4,.64,1);
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    animation: pulse-2fa 2.5s ease-in-out infinite;
                }

                .ll-enable-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 32px rgba(5,150,105,0.4);
                }

                .ll-disable-btn {
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 800;
                    font-size: 13.5px;
                    letter-spacing: .06em;
                    background: linear-gradient(135deg, #DC2626, #7F1D1D);
                    color: #fff;
                    border: none;
                    border-radius: 12px;
                    padding: 11px 26px;
                    cursor: pointer;
                    box-shadow: 0 6px 20px rgba(220,38,38,0.28);
                    transition: all .28s cubic-bezier(.34,1.4,.64,1);
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }

                .ll-disable-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 32px rgba(220,38,38,0.36);
                }

                .ll-2fa-status {
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    font-family: 'Montserrat', sans-serif;
                    font-size: 11.5px;
                    font-weight: 700;
                    letter-spacing: .08em;
                    padding: 5px 12px;
                    border-radius: 999px;
                }

                .ll-2fa-status.enabled {
                    background: rgba(5,150,105,0.12);
                    border: 1px solid rgba(5,150,105,0.28);
                    color: #065F46;
                }

                .ll-2fa-status.disabled {
                    background: rgba(156,163,175,0.15);
                    border: 1px solid rgba(156,163,175,0.28);
                    color: #4B5563;
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

                .ll-success-banner {
                    display: inline-flex;
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

                .ll-info-text {
                    font-family: 'Open Sans', sans-serif;
                    font-size: 13.5px;
                    color: #4A6A8A;
                    line-height: 1.65;
                    background: rgba(14,165,233,0.05);
                    border: 1px solid rgba(14,165,233,0.12);
                    border-radius: 12px;
                    padding: 14px 16px;
                }
            `}</style>

            <h1 className="sr-only">Security settings</h1>

            {/* Badge */}
            <div className="ll-kite-badge">
                <span style={{ animation: 'float-kite 3s ease-in-out infinite', display: 'inline-block' }}>🪁</span>
                Layang-Layang · Kompetisi 2026
            </div>

            {/* ── Password Card ── */}
            <div className="ll-settings-card">
                <div className="ll-deco-ring" style={{ width: 100, height: 100, top: -42, right: -42, border: '1px dashed rgba(14,165,233,0.14)', animationDuration: '24s' }} />
                <div className="ll-deco-ring" style={{ width: 62, height: 62, top: -22, right: -22, border: '1px solid rgba(14,165,233,0.22)', animationDuration: '14s', animationDirection: 'reverse' }} />

                <div className="ll-section-title">
                    <IconKey size={18} color="#0EA5E9" style={{ WebkitTextFillColor: 'unset' } as any} />
                    Perbarui Kata Sandi
                </div>
                <div className="ll-section-desc">Gunakan kata sandi yang panjang dan acak agar akunmu tetap aman</div>

                <Form
                    {...SecurityController.update.form()}
                    options={{ preserveScroll: true }}
                    resetOnError={['password', 'password_confirmation', 'current_password']}
                    resetOnSuccess
                    onError={(errors) => {
                        if (errors.password) passwordInput.current?.focus();
                        if (errors.current_password) currentPasswordInput.current?.focus();
                    }}
                >
                    {({ errors, processing, recentlySuccessful }) => (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {/* Current password */}
                            <div>
                                <div className="ll-field-label">
                                    <IconLock size={13} color="#0EA5E9" />
                                    Kata Sandi Saat Ini
                                </div>
                                <div className="ll-input-wrap">
                                    <span className="ll-icon"><IconLock size={17} /></span>
                                    <PasswordInput
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        name="current_password"
                                        autoComplete="current-password"
                                        placeholder="Kata sandi saat ini"
                                    />
                                </div>
                                <InputError message={errors.current_password} style={{ marginTop: 6, fontSize: 12 }} />
                            </div>

                            {/* New password */}
                            <div>
                                <div className="ll-field-label">
                                    <IconKey size={13} color="#0EA5E9" />
                                    Kata Sandi Baru
                                </div>
                                <div className="ll-input-wrap">
                                    <span className="ll-icon"><IconKey size={17} /></span>
                                    <PasswordInput
                                        id="password"
                                        ref={passwordInput}
                                        name="password"
                                        autoComplete="new-password"
                                        placeholder="Kata sandi baru"
                                    />
                                </div>
                                <InputError message={errors.password} style={{ marginTop: 6, fontSize: 12 }} />
                            </div>

                            {/* Confirm password */}
                            <div>
                                <div className="ll-field-label">
                                    <IconKey size={13} color="#0EA5E9" />
                                    Konfirmasi Kata Sandi
                                </div>
                                <div className="ll-input-wrap">
                                    <span className="ll-icon"><IconKey size={17} /></span>
                                    <PasswordInput
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        autoComplete="new-password"
                                        placeholder="Ulangi kata sandi baru"
                                    />
                                </div>
                                <InputError message={errors.password_confirmation} style={{ marginTop: 6, fontSize: 12 }} />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 4 }}>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="ll-save-btn"
                                    data-test="update-password-button"
                                >
                                    <IconLock size={15} />
                                    Simpan Kata Sandi
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

            {/* ── Two-Factor Card ── */}
            {canManageTwoFactor && (
                <div className={`ll-settings-card ${twoFactorEnabled ? 'll-success' : ''}`}>
                    <div className="ll-deco-ring" style={{ width: 100, height: 100, top: -42, right: -42, border: '1px dashed rgba(14,165,233,0.14)', animationDuration: '20s' }} />
                    <div className="ll-deco-ring" style={{ width: 62, height: 62, top: -22, right: -22, border: '1px solid rgba(14,165,233,0.22)', animationDuration: '12s', animationDirection: 'reverse' }} />

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <div className="ll-section-title">
                            <IconShield size={18} color="#0EA5E9" style={{ WebkitTextFillColor: 'unset' } as any} />
                            Autentikasi Dua Faktor
                        </div>
                        <div className={`ll-2fa-status ${twoFactorEnabled ? 'enabled' : 'disabled'}`}>
                            {twoFactorEnabled
                                ? <><IconCircleCheck size={13} /> Aktif</>
                                : <><IconShieldOff size={13} /> Nonaktif</>
                            }
                        </div>
                    </div>
                    <div className="ll-section-desc">Kelola pengaturan autentikasi dua faktor akunmu</div>

                    {twoFactorEnabled ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div className="ll-info-text">
                                🔐 Kamu akan diminta memasukkan pin aman saat login, yang bisa diambil dari aplikasi TOTP di ponselmu.
                            </div>

                            <div>
                                <Form {...disable.form()}>
                                    {({ processing }) => (
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="ll-disable-btn"
                                        >
                                            <IconShieldOff size={15} />
                                            Nonaktifkan 2FA
                                        </button>
                                    )}
                                </Form>
                            </div>

                            <TwoFactorRecoveryCodes
                                recoveryCodesList={recoveryCodesList}
                                fetchRecoveryCodes={fetchRecoveryCodes}
                                errors={errors}
                            />
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div className="ll-info-text">
                                🛡️ Aktifkan autentikasi dua faktor untuk keamanan ekstra. Kamu akan diminta pin aman saat login dari aplikasi TOTP.
                            </div>

                            <div>
                                {hasSetupData ? (
                                    <button
                                        type="button"
                                        className="ll-enable-btn"
                                        onClick={() => setShowSetupModal(true)}
                                    >
                                        <ShieldCheck size={15} />
                                        Lanjutkan Setup
                                    </button>
                                ) : (
                                    <Form
                                        {...enable.form()}
                                        onSuccess={() => setShowSetupModal(true)}
                                    >
                                        {({ processing }) => (
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="ll-enable-btn"
                                            >
                                                <IconShield size={15} />
                                                Aktifkan 2FA
                                            </button>
                                        )}
                                    </Form>
                                )}
                            </div>
                        </div>
                    )}

                    <TwoFactorSetupModal
                        isOpen={showSetupModal}
                        onClose={() => setShowSetupModal(false)}
                        requiresConfirmation={requiresConfirmation}
                        twoFactorEnabled={twoFactorEnabled}
                        qrCodeSvg={qrCodeSvg}
                        manualSetupKey={manualSetupKey}
                        clearSetupData={clearSetupData}
                        fetchSetupData={fetchSetupData}
                        errors={errors}
                    />
                </div>
            )}
        </>
    );
}

Security.layout = {
    breadcrumbs: [
        {
            title: 'Security settings',
            href: edit(),
        },
    ],
};