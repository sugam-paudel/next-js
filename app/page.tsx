import MultiStepForm from '@/components/MultiStepForm'

export default function Home() {
  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="text-center mb-4">
            <h1 className="h2 mb-3">नेपाली बहु-चरण फारम</h1>
            <p className="text-muted">
              Please fill out all required information in both steps
            </p>
          </div>
          <MultiStepForm />
        </div>
      </div>
    </main>
  )
}