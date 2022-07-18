import { React, useState, useEffect } from "react";
import Input from "../../atoms/Input";
import styles from "./Signup.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { collection, addDoc } from "firebase/firestore/lite";
import { auth, db } from "../../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { storage } from "../../firebase/firebase";


const Signup = () => {
  const navigate = useNavigate();
  const [onChangeData, setOnChangeData] = useState({
    name:"",
    email: "",
    password: "",
    confirmpassword: ""
  });
  const [firebaseError, setFirebaseError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState,
    reset,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name:"",
      email: "",
      password: "",
      confirmpassword: ""
    },
  });

  const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  useEffect(() => {
    const subscription = watch((data) => {
      setOnChangeData(data);
      return () => {
        subscription.unsubscribe();
      };
    });
  }, [watch]);



  

  // console.log(selectedFile);

  const onSubmit = (data) => {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (res) => {
        const user = res.user;
        await addDoc(collection(db, "user"), {
          uid: user.uid,
          name:data.name,
          email: data.email,
          password: data.password,
          confirmpassword: data.confirmpassword
        });
        navigate("/");
      })
      .catch((error) => {
        setFirebaseError(error.message);
      });
  };
  return (
    <>
      <div className={styles.mainFormContainer}>
        <div className={styles.form}>
          <h2 className={styles.header}>Sign Up</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                fieldName='name'
                type='text'
                register={register}
                errors={errors}
                placeHolder='Enter name*'
                isRequired={true}
                minimLength={3}
              />
              {errors.name && (
                <p className={styles.error}>{errors.name.message}</p>
              )}
            </div>
         
            <div>
              <Input
                fieldName='email'
                type='email'
                register={register}
                errors={errors}
                placeHolder='Enter Email*'
                isRequired={true}
                patternn={pattern}
              />
              {errors.email && (
                <p className={styles.error}>{errors.email.message}</p>
              )}
            </div>
            <div>
              <Input
                fieldName='password'
                type='password'
                register={register}
                errors={errors}
                placeHolder='Enter Password*'
                isRequired={true}
                minimLength={8}
              />
              {errors.password && (
                <p className={styles.error}>{errors.password.message}</p>
              )}
            </div>
            <div>
              <Input
                fieldName='confirmpassword'
                type='password'
                register={register}
                errors={errors}
                placeHolder='Enter ConfirmPassword*'
                isRequired={true}
                minimLength={8}
              />
              {errors.confirmpassword ? (
                <p className={styles.error}>{errors.confirmpassword.message}</p>
              ) : onChangeData.confirmpassword &&
                onChangeData.password !== onChangeData.confirmpassword ? (
                <p className={styles.error}>password must be same</p>
              ) : (
                ""
              )}
            </div>
          
           
            <div>
              
              
             
            </div>
            <div>
              <p className={styles.error}>{firebaseError.slice(16)}</p>
            </div>
            <div>
              <button type='submit'>Sign up</button>
            </div>
            <div className={styles.formText}>
              <p>
                already registered?{" "}
                <Link to='/' className={styles.link}>
                  <span className={styles.text}>Login</span>
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
