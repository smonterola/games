import "./Tile.css";

interface Props {
    image?: string;
    number: number;
}

export default function Tile({number, image}: Props) {
    const className: string = [
        "tile",
        number % 2 === 0 && "black-tile",
        number % 2 !== 0 && "white-tile",
        ].filter(Boolean).join(' ');
    return (
        <div className={className}>
            {image && <div style={{backgroundImage: `url(${image})`}} className="chess-piece"></div>}
        </div>
    );    
}