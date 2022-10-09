import React from 'react'
import VerticalSpacer from './VerticalSpacer';

function Contact() {
        return (
            <div className="container">
                <h3>Kontakt z redakcją:</h3>
                <div className="row">
                    <div className="col-lg-6 p-0">
                        <img className="img-fluid" alt="Filmhub building.jpg" src="/img/building.jpg" />
                    </div>
                    <div className="col-lg-6 my-auto">
                        <h3>Dane kontaktowe</h3> <br />
                        <p><i className="fas fa-map-marker-alt"></i> <a href="https://www.google.com/maps/@56.0327094,-32.1752884,8z">Ul. Magiczna 54</a></p>
                        <p style={{ marginLeft: "16px" }}>64-128, Warszawa</p>
                        <p><i className="far fa-envelope"></i><a href="mailto:adres@mailowy.pl"> adres.mail@mailowy.pl</a></p>
                        <p><i className="fas fa-phone"></i> <a href="callto:+48666666666">+ 48 666 777 888</a></p>
                        <br />
                        <p className="text-justify">
                            <strong>FilmHub</strong> to najlepsza firma na świecie! Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the <strong>1500s</strong>, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                        </p>
                    </div>
                </div>
                <VerticalSpacer/>
            </div>
        )
    }

export default Contact