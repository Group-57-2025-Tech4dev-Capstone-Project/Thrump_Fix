
export default function Inputs({
    label,
    type= text,
    name, 
    value,
    placeholder,
    handleChange,
    error


}){
    return(
        <div className="input-field">
            <label>{label }</label>
            <input 
                type={type} 
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={handleChange}
                className={error ? "error" : ""}
            />
            {error && <p className="errorText">{error}</p>}
        </div>
        
    )

}