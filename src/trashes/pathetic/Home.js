import React from 'react';
import {Button, Col, Container, Jumbotron, Row, Table} from "reactstrap";

import CrossfadeImage from "react-crossfade-image";
import ImageGallery from 'react-image-gallery';

import '../leftovers/ad.css';
import '../leftovers/sticky.css';
import StickyBox from "react-sticky-box/dist/react-sticky.esnext";
import {ruben} from "../../Ruben";
import ActionBar from "../losers/ActionBar";
import NavigationBar from "../losers/NavigationBar";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fade2: 0,
            fade3: 0
        }
    }

    componentDidMount() {
        setInterval(
            () => {
                if (this.state.fade2 === 0) {
                    this.setState({
                        fade2: 1
                    })
                } else {
                    this.setState({
                        fade2: 0
                    })
                }
            },
            2000
        );

        setInterval(
            () => {
                if (this.state.fade3 === 0) {
                    this.setState({
                        fade3: 1
                    })
                } else {
                    this.setState({
                        fade3: 0
                    })
                }
            },
            3000
        )
    }

    render() {
        return(
            <Container>
                {/*<ActionBar/>*/}
                {/*<NavigationBar/>*/}
                <Row>
                    <Col md={8} className={"mt-3"}>
                        <Row>
                            <Col md={12}>
                                <ImageGallery
                                    items={part1}
                                    showNav={false}
                                    showThumbnails={false}
                                    showFullscreenButton={false}
                                    showPlayButton={false}
                                    showBullets={false}
                                    showIndex={false}
                                    autoPlay={true}
                                    slideInterval={3000}
                                    infinite={true}
                                    style={{
                                        border: "solid 1px purple"
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row className={"mt-3"}>
                            <Col md={6}>
                                <CrossfadeImage
                                    src={part2[this.state.fade2]}
                                    style={{
                                        width: "379px",
                                        height: "275px",
                                        // border: "solid 1px purple"
                                    }}
                                />
                            </Col>
                            <Col md={6}>
                                <CrossfadeImage
                                    src={part3[this.state.fade3]}
                                    style={{
                                        width: "379px",
                                        height: "275px",
                                        // border: "solid 1px purple"
                                    }}
                                />
                            </Col>
                        </Row>

                        <Row className={"mt-3"}>
                            <Col md={12}>
                                <Jumbotron>
                                    {/*<h1 className="display-3">Hello, world!</h1>*/}
                                    <p className="lead">Aww yeah, xin chào!</p>
                                    {/*<hr className="my-2" />*/}
                                    <p>InfiBook là gì? InfiBook là dự án cộng đồng, phi lợi nhuận nhằm tạo ra một nền tảng nơi mọi người có thể chia sẻ và kết nối với nhau bằng cách tận dụng nguồn tài nguyên sách sẳn có, tránh lãng phí qua đó xây dựng thói quen đọc và chia sẻ sách. Hãy mượn và được tặng sách từ hơn 123 thành viên với hơn 345 quyển sách đang được chia sẻ..</p>
                                    <p className="lead">
                                        <Button color="primary">Tìm hiểu thêm</Button>
                                    </p>
                                </Jumbotron>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} className={"sidebox mt-3 bg-light"}>
                        <StickyBox bottom={false}>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>
                                            <Button color={"primary"}>{ruben.send_feedback}</Button>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>@mdo</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </StickyBox>
                    </Col>
                </Row>
            </Container>
        )
    }
}
export default Home;

const img_url = {
    img1: `https://vietnambiz.vn/stores/news_dataimages/trangth/082017/08/21/in_article/2426_pnc-khaitruong-2.jpg`,
    img2: `http://bizweb.dktcdn.net/100/060/876/files/tan-viet-01.jpg`,
    img3: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3eQ6-CfKaFcQHLfQXapQILr5DLSnCkQRz0iwKnVQhBlePmEW2`,
    img4: `http://static.asiawebdirect.com/m/.imaging/1140x760/website/bangkok/portals/bangkok-com/homepage/magazine/best-currency-exchanges/pagePropertiesImage.jpg`,
    img5: `https://www.bookworks.com/wp-content/uploads/user/5668/books-crop.jpg`,
    img6: `http://thegioibantin.com/wp-content/uploads/2013/11/hi-852-generic-books-8col.jpg`,
    img7: `http://waynehastings.com/wp-content/uploads/2014/11/book_category.jpg`,
    img8: `https://dbbaifpm4v92h.cloudfront.net/assets/splash/brand/tga/catholic_bible.jpg`
};

const part1 = [
    {
        original: img_url.img1,
        thumbnail: img_url.img1,
        originalClass: "fixed-size"
    },
    {
        original: img_url.img2,
        thumbnail: img_url.img2,
        originalClass: "fixed-size"
    },
    {
        original: img_url.img3,
        thumbnail: img_url.img3,
        originalClass: "fixed-size"
    }
];


const part2 = [
    img_url.img4,
    img_url.img5,
];

const part3 = [
    img_url.img6,
    img_url.img7,
    img_url.img8,
];