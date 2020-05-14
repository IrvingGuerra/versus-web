export default {
	data() {
		return {
			dragAndDropCapable: false,
			body: null,
			fileForm: null
		};
	},
	/**
	 * Destroys event listener when component is about to be destroyed.
	 */
	beforeDestroy() {
		if (this.body && this.fileForm) {
			['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach((evt) => {
				this.body.removeEventListener(evt, this.dragDropListener(evt, 'drag-out'));
				this.fileForm.removeEventListener(evt, this.dragDropListener(evt, 'drag-over'));
			});
		}
	},
	methods: {
		initDragAndDrop() {
			// Determine if drag and drop functionality is capable in the browser
			this.dragAndDropCapable = this.determineDragAndDropCapable();

			// If drag and drop capable, then we continue to bind events to our elements.
			if (this.dragAndDropCapable) {
				this.body = $('body')[0];
				this.fileForm = $('#fileForm')[0];
				//Listen to all of the drag events and bind an event listener to each for the fileForm and body elements.
				['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach((evt) => {
					/*
					  For each event add an event listener that prevents the default action
					  (opening the file in the browser) and stop the propagation of the event (so
					  no other elements open the file in the browser)
					*/
					this.body.addEventListener(evt, this.dragDropListener(evt, 'drag-out'));
					this.fileForm.addEventListener(evt, this.dragDropListener(evt, 'drag-over'));

				});
			}
		},
		/**
		 * Returns event listener function when the user drags a file over the screen browser.
		 * @param evt
		 * @param type
		 * @returns {function(*=): (*|void)}
		 */
		dragDropListener(evt, type) {
			return e => this.changeDropArea(e, evt, type);
		},
		/**
		 * Change css style for drop area.
		 * @param e
		 * @param evt
		 * @param type
		 */
		changeDropArea(e, evt, type) {
			e.preventDefault();
			e.stopPropagation();
			if (evt === 'dragover') {
				this.fileForm.classList.add(type);
			} else if (evt === 'dragleave' || evt === 'drop') {
				this.fileForm.classList.remove(type);
			}
			/*
			Capture first file and assign it to our local file variable.
			*/
			if (evt === 'drop') {
				if (e.dataTransfer.files.length > 0) {
					if (e.dataTransfer.files[0].name.endsWith('.csv')) {
						this.file = e.dataTransfer.files[0];
					}
				}
			}
		},
		/*
		  Determines if the drag and drop functionality is in the
		  window
		*/
		determineDragAndDropCapable() {
			/*
			  Create a test element to see if certain events
			  are present that let us do drag and drop.
			*/
			const div = document.createElement('div');

			/*
			  Check to see if the `draggable` event is in the element
			  or the `ondragstart` and `ondrop` events are in the element. If
			  they are, then we have what we need for dragging and dropping files.

			  We also check to see if the window has `FormData` and `FileReader` objects
			  present so we can do our AJAX uploading
			*/
			return (('draggable' in div)
				|| ('ondragstart' in div && 'ondrop' in div))
				&& 'FormData' in window
				&& 'FileReader' in window;
		}
	}
};
