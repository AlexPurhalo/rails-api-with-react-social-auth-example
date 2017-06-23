class ApplicationController < ActionController::API
  def test_action
    render json: { title: "Hello from Rails API :)"}
  end
end
