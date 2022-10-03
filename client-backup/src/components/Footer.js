import React from 'react'
import '../styles/Footer.css'

export default function Footer() {
    return (
        <footer>
            <div id="footer-top"></div>
            <div className="container">
                <div className="footer-row d-flex justify-content-between row m-0">
                    {/*places*/}
                    <div className="footer-places col-lg-4 col-sm-12 footer-paragraphs p-0">
                        <h5>Popularne miejsca</h5>
                        <p><a href="/news">Newsy</a></p>
                        <p><a href="/filmy/order=rating:1/page=1">Filmy</a></p>
                        <p><a href="/seriale/order=rating:1/page=1">Seriale</a></p>
                        <p><a href="/premiery/order=rating:1/page=1">Premiery</a></p>
                    </div>
                    {/*socials*/}
                    <div className="footer-socials d-flex col-lg-4 col-sm-12 p-0">
                        <div className="d-flex w-100 flex-column">
                            <h5>Znajdź nas na:</h5>
                            <div className="d-flex justify-content-around my-auto">
                                <a href="#"><i className="footer-icon fab fa-facebook"></i></a>
                                <a href="#"><i className="footer-icon fab fa-instagram"></i></a>
                                <a href="#"><i className="footer-icon fab fa-twitter-square"></i></a>
                            </div>
                        </div>
                    </div>
                    {/*contact*/}
                    <div className="footer-contact d-flex col-lg-4 col-sm-12 footer-paragraphs justify-content-end top-buffer p-0">
                        <div className="flex-column">
                            <h5>Kontakt z redakcją</h5>
                            <div className="d-flex flex-column footer-paragraphs">
                                <p><i className="fas fa-map-marker-alt"></i> <a href="#">Ul. Specjalna 54</a></p>
                                <p style={{ marginLeft: "16px" }}>64-128, Warszawa</p>
                                <p><i className="far fa-envelope"></i><a href="mailto:adres@mailowy.pl"> adres.mail@mailowy.pl</a></p>
                                <p><i className="fas fa-phone"></i> <a href="callto:+48666666666">+ 48 666 777 888</a></p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-text top-buffer">
                <div className="container text-center">
                    <p className="p-0 m-0">© 2022 Copyright: Jakub Witkowski</p>
                </div>
            </div>
        </footer>
    )
}