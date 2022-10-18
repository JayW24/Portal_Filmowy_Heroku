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
            <div className="bg-secondary"
              style={{
                height: '417px',
                width: '626px',
              }}
            />
          }
          <img className="card-img-top"
            style={this.state.loaded ? {} : {display: 'none'}}
            src={this.props.src}
            onLoad={() => this.setState({loaded: true})}
            alt={this.props.alt}
          />
        </>
      );
    }
  }

  export default ImageLoading;