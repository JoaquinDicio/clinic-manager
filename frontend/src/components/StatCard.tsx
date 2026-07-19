type Props = {
    title: string
    value: number | string
}

export default function StatCard({ title, value }: Props) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border">

            <p className="text-sm text-gray-500">
                {title}
            </p>

            <p className="text-2xl font-bold">
                {value}
            </p>

        </div>
    )
}