import Link from "next/link";
import Layout from "../components/Layout";
import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import styles from "./index.module.css"

//getServerSidePropsから渡されるpropsの型
type Props = {
  initialImageUrl: string;
};

//ページコンポーネント関数にpropsを受け取る引数を追加する
const IndexPage: NextPage<Props>=({initialImageUrl})=>{
  //①useStateを使って状態を定義する
  const[imageUrl, setImageUrl] = useState(initialImageUrl);//初期値を渡す
  const[loading, setLoading] = useState(false);//trueで呼び出し中を意味する

  //②マウント時に画像を読み込む宣言
  // useEffect(() => {
  //   fetchImage().then((newImage) => {
  //     setImageUrl(newImage.url);//画像urlの状態を更新する
  //     setLoading(false);//ローディング状態を更新する
  //   });
  // }, []);

  //ローディング中でなければ、画像を表示する
  // return <div>{loading || <img src={imageUrl}/>}</div>;

  //ボタンをクリックしたときに画像を読み込む処理
  const handleClick = async () => {
    setLoading(true);//読み込み中フラグを立てる
    const newImage = await fetchImage();
    setImageUrl(newImage.url);//画像URLの状態を更新する
    setLoading(false);
  };
  return(
    <div>
      <button onClick={handleClick}>他の猫も見る</button>
      <div className={styles.frame}>{loading || <img src={imageUrl} className={styles.img}/>}</div>
    </div>
  );
};

// const IndexPage: NextPage=()=>{
//   //①useStateを使って状態を定義する
//   const[imageUrl, setImageUrl] = useState("");
//   const[loading, setLoading] = useState(true);//trueで呼び出し中を意味する

//   //②マウント時に画像を読み込む宣言
//   useEffect(() => {
//     fetchImage().then((newImage) => {
//       setImageUrl(newImage.url);//画像urlの状態を更新する
//       setLoading(false);//ローディング状態を更新する
//     });
//   }, []);

//   //ローディング中でなければ、画像を表示する
//   // return <div>{loading || <img src={imageUrl}/>}</div>;

//   //ボタンをクリックしたときに画像を読み込む処理
//   const handleClick = async () => {
//     setLoading(true);//読み込み中フラグを立てる
//     const newImage = await fetchImage();
//     setImageUrl(newImage.url);//画像URLの状態を更新する
//     setLoading(false);
//   };
//   return(
//     <div>
//       <button onClick={handleClick}>他の猫も見る</button>
//       <div>{loading || <img src={imageUrl} />}</div>
//     </div>
//   );
// };

export default IndexPage;

//サーバーサイドで実行する処理
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const image = await fetchImage();
  return{
    props:{
      initialImageUrl: image.url,
    },
  };
};

type Image = {
  url: string;
};

const fetchImage = async (): Promise<Image> => {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const images = await res.json();
  console.log(images);
  return images[0];
};

fetchImage().then((image) => {
  console.log(image.alt);
});