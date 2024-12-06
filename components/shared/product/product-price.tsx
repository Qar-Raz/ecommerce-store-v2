import { cn } from '@/lib/utils'
const ProductPrice = ({
  value,
  className,
}: {
  value: number
  className?: string
}) => {
  const stringValue = value.toString()
  const [intValue, floatValue] = stringValue.includes('.')
    ? stringValue.split('.')
    : [stringValue, '']
  return (
    <p className={cn('text-2xl', className)}>
      <span className="text-xs align-super">Rs </span>
      {intValue}
      <span className="text-xs align-super">{floatValue}</span>
    </p>
  )
}
export default ProductPrice

// have specified the type of currency in this file as Rs
