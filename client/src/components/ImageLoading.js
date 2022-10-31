import React from 'react';

class ImageLoading extends React.Component {
    constructor(){
      super();
      this.state = {loaded: false};
    }
  
    render(){
      return (
        <>
          {this.state.loaded ? null :
            <div className={`bg-light d-flex justify-content-center align-items-center flex-column`} style={this.props.style_}>
                <p className="text-secondary font-italic">{this.props.alt_}</p>
                <i style={{fontSize: "30px;"}} class="fa-solid fa-image text-secondary"></i>
            </div>
          }
          <img className={this.props.className_}
            style={this.state.loaded ? this.props.style : {display: 'none'}}
            src={this.props.src}
            onLoad={() => this.setState({loaded: true})}
            alt={this.props.alt}
          />
        </>
      );
    }
  }

  export default ImageLoading;