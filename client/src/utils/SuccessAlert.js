import Swal from 'sweetalert2'

const successAlert = (title) => {
    const alert = Swal.fire({
        icon: "success",
        title: decodeURIComponent(title),

        confirmButtonColor: "#00b050",
        // background: "#00000" ,
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = '/'; // Redirect to homepage
        }
    });

    return alert;
}
export default successAlert