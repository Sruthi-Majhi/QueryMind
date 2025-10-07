import './Sidebar.css';
function Sidebar(params) {
    return (
        <section className='sidebar'>
            <button>
                <img className= 'logo' src="src/assets/blacklogo.png" alt="logo" />
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            <ul className='history'>
                <li>his1</li>
                <li>his2</li>
                <li>his3</li>
            </ul>

            <div className='sign'>
                <p>By Sruthi &hearts;</p>
            </div>
        </section>
        )
}
export default Sidebar;
