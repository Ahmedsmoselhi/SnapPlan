
type LogoProps = {
    size?: string; // pass Tailwind size class like "text-2xl" or "text-4xl"
};

const Logo: React.FC<LogoProps> = ({ size = "text-2xl" }) => {
    return (
        <span className={`font-bold tracking-tight ${size}`}>
            <span className="text-orange-600">Sna</span>
            <span className="text-slate-900">Plan</span>
        </span>
    );
};

export default Logo;
