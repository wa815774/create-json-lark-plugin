import './style.css'

const SmartlingRule = () => {
    return <ul className='smartling-rule'>
        <li>key 层级不大于 3；</li>
        <li>key 长度不大于 24；</li>
        <li>key 不包含空格；</li>
        <li>key 不包含大写；</li>
    </ul>
}

export default SmartlingRule