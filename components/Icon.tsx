import type { SVGProps } from 'react'
import {
    AcademicCapIcon,
    BeakerIcon,
    BuildingStorefrontIcon,
    CameraIcon,
    ChartBarIcon,
    ChatBubbleLeftRightIcon,
    ClockIcon,
    ComputerDesktopIcon,
    CurrencyDollarIcon,
    EnvelopeIcon,
    FireIcon,
    GlobeAltIcon,
    HeartIcon,
    HomeIcon,
    MapIcon,
    MapPinIcon,
    PaintBrushIcon,
    PhoneIcon,
    SparklesIcon,
    UserGroupIcon,
    WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'

const iconMap = {
    peternakan: BeakerIcon,
    pertanian: SparklesIcon,
    umkm: BuildingStorefrontIcon,
    pariwisata: MapIcon,
    pendidikan: AcademicCapIcon,
    kesehatan: HeartIcon,
    budaya: PaintBrushIcon,
    susu: BeakerIcon,
    peta: MapIcon,
    galeri: CameraIcon,
    kontak: ChatBubbleLeftRightIcon,
    merapi: FireIcon,
    home: HomeIcon,
    phone: PhoneIcon,
    email: EnvelopeIcon,
    clock: ClockIcon,
    location: MapPinIcon,
    money: CurrencyDollarIcon,
    people: UserGroupIcon,
    chart: ChartBarIcon,
    service: WrenchScrewdriverIcon,
    digital: ComputerDesktopIcon,
    globe: GlobeAltIcon,
    koperasi: BuildingStorefrontIcon,
    kuliner: SparklesIcon,
    kerajinan: PaintBrushIcon,
    jasa: WrenchScrewdriverIcon,
    default: SparklesIcon,
} as const

export type IconName = keyof typeof iconMap

interface IconProps extends SVGProps<SVGSVGElement> {
    name: IconName | string
    size?: number
    className?: string
}

export function resolveIconName(value?: string | null): IconName {
    if (!value) return 'default'
    const key = value.trim().toLowerCase()
    if (key in iconMap) return key as IconName

    // Map common labels / legacy emoji-ish values to clean icons
    const aliases: Record<string, IconName> = {
        peternakan: 'peternakan',
        pertanian: 'pertanian',
        umkm: 'umkm',
        pariwisata: 'pariwisata',
        pendidikan: 'pendidikan',
        kesehatan: 'kesehatan',
        budaya: 'budaya',
        koperasi: 'koperasi',
        kuliner: 'kuliner',
        kerajinan: 'kerajinan',
        jasa: 'jasa',
        susu: 'susu',
        peta: 'peta',
        galeri: 'galeri',
        kontak: 'kontak',
        merapi: 'merapi',
        alamat: 'location',
        whatsapp: 'phone',
        email: 'email',
        jam: 'clock',
        dukuh: 'people',
        sekretaris: 'chart',
        bendahara: 'money',
    }

    return aliases[key] ?? 'default'
}

export default function Icon({ name, size = 20, className = '', ...props }: IconProps) {
    const resolved = resolveIconName(name)
    const Cmp = iconMap[resolved] ?? iconMap.default

    return (
        <Cmp
            width={size}
            height={size}
            className={className}
            aria-hidden="true"
            {...props}
        />
    )
}

export function IconBadge({
    name,
    color = 'var(--gold)',
    size = 20,
    className = '',
}: {
    name: IconName | string
    color?: string
    size?: number
    className?: string
}) {
    return (
        <span
            className={`inline-flex items-center justify-center rounded-xl flex-shrink-0 ${className}`}
            style={{
                width: size + 24,
                height: size + 24,
                backgroundColor: `${color}18`,
                color,
            }}
            aria-hidden="true"
        >
            <Icon name={name} size={size} />
        </span>
    )
}
