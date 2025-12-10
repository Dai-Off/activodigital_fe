interface MetricTooltipProps {
    text: string;
    borderColor: 'blue' | 'emerald' | 'indigo' | 'green' | 'orange';
}

const MetricTooltip = ({ text, borderColor }: MetricTooltipProps) => {
    const borderColorClasses = {
        blue: 'border-blue-300',
        emerald: 'border-emerald-300',
        indigo: 'border-indigo-300',
        green: 'border-green-300',
        orange: 'border-orange-300',
    };
    
    return (
        <div className={`absolute top-10 right-2 bg-white border-2 ${borderColorClasses[borderColor]} rounded-lg shadow-xl p-4 w-80 z-20 text-left`}>
            <p className="text-xs text-gray-700">
                {text}
            </p>
        </div>
    );
};

export default MetricTooltip;

