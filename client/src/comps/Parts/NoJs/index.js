{/* <ResponsiblePerson data={data.task} onClick1={this.writeTaskData}/> */}

class ResponsiblePerson extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      save: false,
      userName: "Не выбран",
      userId: ""
    }

    this.writeTaskResponsiblePerson = this.writeTaskResponsiblePerson.bind(this)
  }

  componentDidMount(){
    if (this.props.data.assignedTo)
      this.setState({userName: this.props.data.assignedTo.username, userId: this.props.data.assignedTo.id })
  }

  handleClick = () => {
    this.setState({save: !this.state.save})
  }

  writeTaskResponsiblePersonOld (e)
  {
    this.setState({ userId: e.target.value, userName: e.target.querySelector(`option[value="${e.target.value}"]`).text })
    this.props.onClick1(e, "assignedTo", true);
    this.handleClick()
  }
  writeTaskResponsiblePerson(id, name)
  {
    this.setState({ userId: id, userName: name })
    this.props.onClick1(id, "assignedTo", true, name);
    this.handleClick()
  }

  render() {
    const { data } = this.props
    const { save, userName, userId } = this.state


    return (
      !save ? (
        <UserRow click = {this.handleClick} size="32" id={userId} name={userName} icon="1" ondelete={(id)=>{console.log(id)}} />
      ) : ( <FakeSelect onselect={this.writeTaskResponsiblePerson} defaultid={userId} array={data.users}/>
      )

    );
  }
}
