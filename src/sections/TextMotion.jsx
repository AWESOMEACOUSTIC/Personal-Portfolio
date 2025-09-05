import Word from "../components/Word";
import LogoShell from "../components/LogoShell";


export default function TextMotion() {
    return (
        <LogoShell>
            <div className="text-center">
                <Word text="MOTION" className="text-6xl md:text-7xl font-black tracking-[0.08em] uppercase" />
                <div className="mt-1 text-xl md:text-2xl font-semibold tracking-[0.18em]">BY NICK</div>
            </div>
        </LogoShell>
    );
}