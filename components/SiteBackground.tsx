export default function SiteBackground() {
    return (
        <div className="site-bg" aria-hidden="true">
            <div className="site-bg__base" />
            <div className="site-bg__glow site-bg__glow--left" />
            <div className="site-bg__glow site-bg__glow--right" />
            <div className="site-bg__grid" />
            <div className="site-bg__vignette" />
            <div className="site-bg__noise" />
        </div>
    )
}
